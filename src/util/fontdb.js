import common from './common'


const fs = window.require('fs');
const path = window.require('path');
const fontkit = window.require('fontkit');
const DataStore  = window.require('nedb');


const db = new DataStore({ filename : 'data/font.data' });
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
        language : getLanguage(font.name || {}),
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

    fontObj.collectFontFamily = common.getFontFamilyCollect(font);

    db.insert(fontObj, (err, docs) => {
        done && done();
    });
}

const fontInfo = function (realpath, done) {
    fontkit.open(realpath, null, function (err, font) {
        if (err) {
            done && done();
            return;
        }

        if (font.header) {

            const nameList = font.fonts.map((f) => f.fontFamily);

            font.fonts[0].nameList = nameList; 

            done && done(font.fonts[0]);

        } else if (font && font.directory.tables.glyf) {
            done && done(font);
        } else {
            done && done();
        }
    });
}

const glyfInfo = function (realpath, done) {
    fontInfo(realpath, (font) => {
        if (font) {
            done && done(font.characterSet);
        } else {
            done && done([]);
        }
    })
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

        if (total === 0) { done && done(); return; }

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

const addFolder = (directory, done) => {
    directoryDB.findOne({ directory }, (err, doc) => {
        if (doc) {
            done && done();
            return; 
        }

        // 데이타 베이스 무조건 새로고침 

        const hash = createMd5(directory);

        // 디렉토리 정보 다시 입력 
        directoryDB.insert({
            directory,
            name: path.basename(directory),            
            user: true,
            hash: hash.hash,
            files: hash.files 
        });

        if (hash.files.length){

            // 전체 폰트정보 업데이트 
            updateFont(directory, hash, done)
        } else {
            done && done()
        }
        

    })
} 

const update = (directory, done) => {
    directoryDB.findOne({ directory }, (err, doc) => {
        if (doc) {
             if (doc.hash === createMd5(directory).hash) {
                 //  변화 없음
                 done && done();
                 return; 
             }
        }

        // 데이타 베이스 무조건 새로고침 

        const hash = createMd5(directory);

        // 디렉토리 정보 다시 입력 
        directoryDB.insert({
            directory,
            name: path.basename(directory),
            hash: hash.hash,
            files: hash.files 
        });
        
        // 전체 폰트정보 업데이트 
        updateFont(directory, hash, done)

    })

}

const folderList = (callback) => {
    directoryDB.find({ user : true}, (err, docs) => {
        docs.sort(function(a, b) {
            return a.name <  b.name ? -1 : 1;
        })
        callback && callback(docs);
    })
}

const removeDirectory = (directory, callback) => {
    directoryDB.remove({ directory }, { multi : true}, (err, num) => {
        callback && callback();
    })
}

const list = (directory, callback) => {
    db.find({ 'item.directory' : directory}, (err, docs) => {
        docs.sort(function(a, b) {
            return a.currentFamilyName <  b.currentFamilyName ? -1 : 1;
        })

        let filteredList = [];
        let keys = {};

        docs.forEach((doc) => {
            if (!keys[doc.familyName]) {
                filteredList[filteredList.length] = doc;
                keys[doc.familyName] = doc; 
            }
        })

        callback && callback(filteredList);
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

const fontTree = (callback) => {

    let tree = [];

     directoryDB.find({ user : true}, (err, docs) => {
        docs.sort(function(a, b) {
            return a.name <  b.name ? -1 : 1;
        })

        // 시스템 폰트 목록이랑 합치기 
        docs = common.getSystemFolders().concat(docs);

        const total = docs.length;
        let count = 0; 
        docs.forEach((doc) => {

            list(doc.directory, function (files) {

                tree.push({
                    directory : doc.directory, 
                    name : doc.name,
                    files : files
                })

                console.log(files);

                count++;

                if (count === total) {
                    callback && callback(tree);
                }
            })


        })

    })
}

const fontdb = {
    fontTree,
    fontInfo,
    glyfInfo,
    findOne,
    list,
    update,
    addFolder,
    folderList,
    removeDirectory
}

export default fontdb