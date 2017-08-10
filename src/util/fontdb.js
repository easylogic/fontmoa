import common from './common'
import cssMaker from './cssMaker'


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

    fontObj.collectStyle = common.getFontStyleCollect(font);

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
            const css = cssMaker.createFontCss(realpath, font);
            done && done(font, css, font.characterSet);
        } else {
            done && done({}, {}, []);
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
    directoryDB.findOne({ type : 'user', directory }, (err, doc) => {
        if (doc) {
            done && done();
            return; 
        }

        // 데이타 베이스 무조건 새로고침 
        const hash = createMd5(directory);
        const name = path.basename(directory);
        // 디렉토리 정보 다시 입력 
        directoryDB.insert({
            type: 'user',
            directory,
            alias : name,
            name: name,            
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

const addLibrary = (library, done) => {
    directoryDB.findOne({ type: 'library',  library }, (err, doc) => {
        if (doc) {
            done && done();
            return; 
        }

        directoryDB.count({ type: 'library'}, (err2, count) => {
            // 디렉토리 정보 다시 입력 
            directoryDB.insert({
                type: 'library',
                index: count,
                library,
                files: []
            });

            done && done()
        })

    })
} 

const toggleFavorite = (path, isAdd, done) => {

    directoryDB.findOne({ type: 'favorite' }, (err, favorite) => {

        if (favorite) {

            // 이미 있고 ,  isAdd 가 false 인 경우 favorite 에서 뺀다. 
            if (favorite.files.includes(path) && !isAdd) {
                // path 가 아닌 것만 
                favorite.files = favorite.files.filter((p) => {
                    return path !== p; 
                })
            } else {
                // 아닌 경우 path 를 추가한다. 
                favorite.files.push(path);
            }

            // 최종 db 를 업데이트 한다. 
            directoryDB.update({ type : 'favorite'}, { $set : { files : favorite.files } }, {multi : true },  (err, count) => {
                done && done();
            });
        } else {
            // 디렉토리 정보 다시 입력 
            if (isAdd) {
                directoryDB.insert({ type: 'favorite', files : [path] }, (err) => {
                    done && done();
                });
            } else {    // 아무것도 없는데 isAdd 가 false 인 경우 (지우는 경우 )

            }

            done && done()
        }

    })
} 

const appendFileToLibrary = (library, filepath, done) => {
    directoryDB.findOne({ type: 'library',  library }, (err, doc) => {
        if (doc) {

            if (!doc.files.includes(filepath)) {
                directoryDB.update({ 
                    type: 'library',  library 
                }, { 
                    $push: { 
                        files: filepath 
                    } 
                }, {}, function () {
                    done && done(true);
                });
            } else {
                done && done(true);
            }
        } else {
            done && done(false)
        }

    })
}

const removeFileInLibrary = (library, filepath, done) => {
    directoryDB.findOne({ type: 'library',  library }, (err, doc) => {
        if (doc) {
            if (doc.files.includes(filepath)) { // 파일 리스트가 포함이 되어 있으면 리스트에서 삭제한다. 
                const files = doc.files.filter((file) => {
                    return filepath !== file; 
                })

                directoryDB.update({ 
                    type: 'library',  library 
                }, { 
                    $set: { 
                        files: files        // 새로운 리스트를 셋팅 
                    } 
                }, {}, function () {
                    done && done(true);
                });
            } else {
                done && done(true);
            }
        } else {
            done && done(false)
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

const getUserFolders = (callback) => {
    directoryDB.find({ type : 'user' }, (err, docs) => {
        docs.sort(function(a, b) {
            return a.name <  b.name ? -1 : 1;
        })
        callback && callback(docs);
    })
}

const getLibraryList = (callback) => {
    directoryDB.find({ type : 'library' }, (err, libraries) => {
        libraries.sort(function(a, b) {
            return (a.index || 0) <  (b.index || 0) ? -1 : 1;
        })
        callback && callback(libraries);
    })
}

const filterFiles = (files) => {
    files.sort(function(a, b) {
        return a.currentFamilyName <  b.currentFamilyName ? -1 : 1;
    })

    let filteredList = [];
    let keys = {};

    files.forEach((doc) => {
        if (!keys[doc.familyName]) {
            filteredList[filteredList.length] = doc;
            keys[doc.familyName] = doc; 
        }
    })

    return filteredList;
}

const removeDirectory = (directory, callback) => {
    directoryDB.remove({ type : 'user', $or : [ {directory}, {_id : directory}  ]  }, { multi : true}, (err, num) => {
        callback && callback();
    })
}

const removeLibrary = (library, callback) => {
    directoryDB.remove({ type: 'library', $or : [{library}, { _id : library }] }, { multi : true}, (err, num) => {
        callback && callback();
    })
}

const getFiles = (directory, callback) => {
    db.find({ 'item.directory' : directory}, (err, files) => {
        callback && callback(filterFiles(files));
    })
}

const getUserFiles = (directory, callback) => {
    directoryDB.findOne({ type: 'user', $or : [ {directory}, {_id : directory} ]  }, (err, doc) => {
        if (doc) {
            getFiles(doc.directory, (files) => {
                callback && callback(filterFiles(files));
            })
        } else {
            callback && callback([]);
        }
        
    })
}

const getLibraryFiles = (library, callback) => {
    directoryDB.findOne({ type: 'library', $or : [ {library}, {_id : library} ]  }, (err, library) => {
        if (library) {
            db.find({ 'item.path' : { $in : library.files }  }, (err2, files) => {
                callback && callback(filterFiles(files));
            })
        } else {
            callback && callback([]);
        }
        
    })
}

const getFavoriteFiles = (callback) => {
    directoryDB.findOne({ type : 'favorite' }, (err, favorite) => {

        if (favorite) {
            db.find({ 'item.path' : { $in : favorite.files }  }, (err2, files) => {
                callback && callback(filterFiles(files));
            })
        } else {
            callback && callback([]);
        }
    })
}

const getFavoriteFilesPathList = (callback) => {
    directoryDB.findOne({ type : 'favorite' }, (err, favorite) => {

        if (favorite) {
            callback && callback(favorite.files);
        } else {
            callback && callback([]);
        }
    })
}



const getFavoriteCount = (callback) => {
    directoryDB.findOne({ type : 'favorite' }, (err, favorite) => {
        const count = (favorite) ? favorite.files.length : 0;
        callback && callback(count);
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

     directoryDB.find({ type : 'user' }, (err, docs) => {
        docs.sort(function(a, b) {
            return a.name <  b.name ? -1 : 1;
        })

        // 시스템 폰트 목록이랑 합치기 
        docs = common.getSystemFolders().concat(docs);
        const total = docs.length;
        let count = 0; 
        docs.forEach((doc) => {

            getFiles(doc.directory, function (files) {

                tree.push({
                    directory : doc.directory, 
                    name : doc.name,
                    files : files
                })

                count++;

                if (count === total) {
                    callback && callback(tree);
                }
            })


        })

    })
}

const fontdb = {
    /* load  directories with files for tree Structure  */
    fontTree,

    fontInfo,
    glyfInfo,
    findOne,

    /* add user resource */
    addFolder,
    addLibrary,
    toggleFavorite,

    /* get count */
    getFavoriteCount,

    /* append to library */
    appendFileToLibrary,

    /* get user folders */
    getUserFolders,

    /* get library list */
    getLibraryList,
    
    /* get files */
    getFiles,
    getUserFiles,
    getLibraryFiles,
    getFavoriteFiles,
    getFavoriteFilesPathList,

    update,

    /* remove resource */
    removeDirectory,
    removeLibrary,
    removeFileInLibrary,

}

export default fontdb