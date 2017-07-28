
const fs = window.require('fs');
const path = window.require('path');
const fontkit = window.require('fontkit');
const DataStore  = window.require('nedb'),
        db = new DataStore({ filename : 'data/font.data' });
db.loadDatabase((err) => {});

const directoryDB = new DataStore({ filename : 'data/directory.data' });
directoryDB.loadDatabase((err) => {})

const crypto = require('crypto');

const exts = ['ttf', 'otf', 'woff', 'ttc'];

const getLanguage = (name) => {
    let list = ['en'];

    if (name && name.records) {
        const records = name.records;
        const keys = Object.keys(records);

        if (records[keys[0]]) {
            list = Object.keys(records[keys[0]]);
        }
    }
    
    return list;
}

const getNames = (name) => {

    let list = {}

    if (name && name.records) {
        return name.records;
    }

    return list; 
}

const insertFont = (font, item, done) => {

    const fontObj = {
        size: font.stream.length,
        postscriptName : font.postscriptName,
        fullName: font.fullName,
        familyName: font.familyName,
        subfamilyName: font.subfamilyName,
        copyright: font.copyright, 
        version: font.version,
        unitsPerEm: font.unitsPerEm,
        ascent: font.ascent,
        descent: font.descent,
        lineGap: font.lineGap,
        underlinePosition: font.underlinePosition,
        underlineThickness: font.underlineThickness,
        italicAngle: font.italicAngle,
        capHeight: font.capHeight,
        xHeight: font.xHeight,
        bbox: font.bbox,
        nameList : font.nameList || [],
        item: item,
        name : getNames(font.name || {}),
        language : getLanguage(font.name || {})
    }


    const currentLanguage = fontObj.language.filter((l) => {
        return l !== 'en' && l !== '0-0'
    }).pop() || 'en';
    const familyName = fontObj.name.fontFamily[currentLanguage] || fontObj.familyName;    

    fontObj.currentFamilyName = familyName;
    fontObj.currentLanguage = currentLanguage;

    const sub = fontObj.subfamilyName.toLowerCase();
    if (sub.includes('italic')) {
        fontObj.italic = true;
    }

    if (sub.includes('bold')) {
        fontObj.bold = true;
    }

    db.insert(fontObj, (err, docs) => {
        done && done();
    });
}

const createFont = function (file, directory, done) {
    const item = { 
        path : path.resolve(directory, file),
        directory : directory, 
        name : path.basename(file), 
        ext : path.extname(file).split('.').pop()
    }

    const ext = item.ext.toLowerCase(); 
    const realpath = item.path; 

    if (exts.includes(ext)) {
    
        fontkit.open(realpath, null, function (err, font) {

            if (err) {
                done && done();
                return;
            }


            if (font.header) {

                const nameList = font.fonts.map((f) => f.fontFamily);

                font.fonts[0].nameList = nameList; 
                insertFont(font.fonts[0], item, done);
            } else if (font && font.directory.tables.glyf) {
                insertFont(font, item, done);
            } else {
                done && done();
            }
        });
    } else {
        // ttf 형태가 아니면 어짜피 관리를 못함. 
        //insertFont({}, item, done);
        done && done();
    }
}

const createMd5 = (path) => {
    var files = fs.readdirSync(path);

    files = files.filter((f) => {
        const ext = f.toLowerCase().split('.').pop();
        return exts.includes(ext);
    })

    var data = files.join(':');

    return { hash : crypto.createHash('md5').update(data).digest("hex"), files : files };
}

const updateFont = (directory, hash, done) => {
    // 폰트 정보 모두 지우고 
    db.remove({'item.directory' : directory}, {multi: true}, function (err, num) {
        //  전체 폰트 정보 다시 만들기 
        const total = hash.files.length;
        let count = 0;  
        hash.files.forEach((file) => {
            createFont(file, directory, function () {
                count++;

                if (count === total) {
                    done && done();
                }
            });
        })

    })
}

const update = (directory, done) => {
    directoryDB.findOne({ directory }, (err, doc) => {
        // if (doc) {
        //     if (doc.hash === createMd5(directory).hash) {
        //         //  변화 없음
        //         //done && done();
        //         //return; 
        //     }
        // }

        // 데이타 베이스 무조건 새로고침 

        const hash = createMd5(directory);
        // 기존 디렉토리 지우고 
        directoryDB.remove({ hash : hash.hash}, { multi : true}, function (err, num) {

            // 디렉토리 정보 다시 입력 
            directoryDB.insert({
                directory,
                hash: hash.hash,
                files: hash.files 
            });
            
            // 전체 폰트정보 업데이트 
            updateFont(directory, hash, done)
        })


    })

}

const list = (directory, callback) => {
    db.find({ 'item.directory' : directory}, (err, docs) => {
        docs.sort(function(a, b) {
            return a.currentFamilyName <  b.currentFamilyName ? -1 : 1;
        })
        callback && callback(docs);
    })
}

const findOne = (path, callback) => {
    db.findOne({ 'item.path' : path}, (err, doc) => {
        if (err) {
            doc = {};
        }

        callback && callback(doc);        
    })
}

const fontdb = {
    findOne: findOne,
    list: list,
    update: update 
}

export default fontdb