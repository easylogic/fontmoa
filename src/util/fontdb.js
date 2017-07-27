
const fs = window.require('fs');
const path = window.require('path');
const fontkit = window.require('fontkit');
const DataStore  = window.require('nedb'),
        db = new DataStore({ filename : 'data/font.data' });
db.loadDatabase((err) => {});

const directory = new DataStore({ filename : 'data/directory.data' });
directory.loadDatabase((err) => {})

const crypto = require('crypto');

const insertFont = (font, item) => {
    const fontObj = {
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
        item: item,
    }

    db.insert(fontObj, (err, docs) => {});

    return fontObj;
}

const createFont = function (file, directory) {
    const item = { 
        path : path.resolve(directory, file),
        directory : directory, 
        name : path.basename(file), 
        ext : path.extname(file) 
    }

    const ext = item.ext; 
    const realpath = item.path; 

    if (ext === '.ttf' || ext === '.otf' || ext === '.woff' || ext === '.ttc') {
    
        fontkit.open(realpath, null, function (err, font) {
            if (font.header) {
                font.fonts.forEach(function(f) {
                    insertFont(f, item);
                })
            } else {
                insertFont(font, item);
            }
        });
    } else {
        // 없는 애들은 그냥 넣어보자. 
        insertFont({}, item);
    }
}

const createMd5 = (path) => {
    var files = fs.readdirSync(path);
    var data = files.join(':');

    return { hash : crypto.createHash('md5').update(data).digest("hex"), files : files };
}

const updateFont = (directory, hash) => {
    // 폰트 정보 모두 지우고 
    db.remove({'item.directory' : directory}, {multi: true}, function (err, num) {
        //  전체 폰트 정보 다시 만들기 
        hash.files.forEach((file) => {

            createFont(file, directory);
        })

    })
}

const update = (directory) => {
    directory.findOne({ directory : directory}, (err, doc) => {
        if (doc) {
            if (doc.hash == createMd5(directory).hash) {
                //  변화 없음
                return; 
            }
        }

        const hash = createMd5(directory);
        // 기존 디렉토리 지우고 
        directory.remove({ hash : hash.hash}, { multi : true}, function (err, num) {

            // 디렉토리 정보 다시 입력 
            directory.insert({
                directory: directory,
                hash: hash.hash,
                files: hash.files 
            });
            
            // 전체 폰트정보 업데이트 
            updateFont(directory, hash)
        })


    })

}

const fontdb = {
    update: update 
}

export default fontdb