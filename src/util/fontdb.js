import common from './common'
import cssMaker from './cssMaker'


const fs = window.require('fs');
const path = window.require('path');
const fontkit = window.require('fontkit');
const DataStore  = window.require('nedb');
const _ = window.require('lodash')


const db = new DataStore({ filename : 'data/font.data' });
db.loadDatabase((err) => {});

const directoryDB = new DataStore({ filename : 'data/directory.data' });
directoryDB.loadDatabase((err) => {})

const crypto = require('crypto');

const exts = ['.ttf', '.otf', '.woff', '.ttc'];

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

const insertFont = (font, fontObj, done) => {

    try {
        const units = font.unitsPerEm;
    } catch (e) {
        return done && done();
    }

    const fontItem = {
        postscriptName : (font.name ? font.postscriptName : ''),
        fullName: (font.name ? font.fullName : ''),
        familyName: (font.name ? font.familyName : ''),
        subfamilyName: (font.name ? font.subfamilyName : ''),
        copyright: (font.name ? font.copyright : ''), 
        version: (font.name ? font.version : ''),
        unitsPerEm: font.unitsPerEm,
        nameList : font.nameList || [],
        name : getNames(font.name || {}),
        language : getLanguage(font.name || {}),
    }

    const currentLanguage = fontItem.language.filter((l) => {
        return l !== 'en' && l !== '0-0'
    }).pop() || 'en';

    if (fontItem.name.fontFamily) {
        const familyName = fontItem.name.fontFamily[currentLanguage] || fontItem.familyName;    

        fontItem.currentFamilyName = familyName;
    }

    fontItem.currentLanguage = currentLanguage;

    if (fontItem.subfamilyName) {
        const sub = fontItem.subfamilyName.toLowerCase();
        if (sub.includes('italic')) {
            fontItem.italic = true;
        }
    
        if (sub.includes('bold')) {
            fontItem.bold = true;
        }
    }


    fontItem.collectStyle = common.getFontStyleCollect(font);

    fontObj.font = fontItem; 

    db.insert(fontObj, (err, docs) => {
        // 최종 폰트를 입력한 이후 callback 수행 
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

const createFont = function (fontObj, done) {


    const ext = path.extname(fontObj.file).toLowerCase(); 
    const realpath = fontObj.file; 

    if (exts.includes(ext)) {

        fontkit.open(realpath, null, function (err, font) {

            if (err) {
                //폰트 정보를 로드를 못하면 데이타를 추가 하지 않는다. 
                console.log(err);
                done && done();
                return;
            }

            if (font.header) {  // ttc 의 경우 가장 첫번째 폰트를 기준으로 데이타를 저장한다. 
                const nameList = font.fonts.map((f) => f.fontFamily);

                font.fonts[0].nameList = nameList; 

                insertFont(font.fonts[0], fontObj, done);
            } else if (font && font.directory.tables.glyf) {
                // 개별 폰트가 있을 때 
                insertFont(font, fontObj, done);
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

const createMd5 = (directory, type) => {
    console.log(directory, 'createMd5')
    if (fs.existsSync(directory) === false) {
        return { }
    }
    let files = fs.readdirSync(directory);
    console.log(files);

    //디렉토리에 폰트가 다 보여있다. 
    files = files.filter((f) => {
        return exts.includes(path.extname(f));
    }).map(f => path.resolve(directory, f));

    return { files : files };
}

const initializeFontFile = (file, category_id) => {
    return {
        file,                   // 이건 font 파일 패스 
        category : category_id, // 카테고리는 system, googlefont, userfolder 로 고정이군 
        labels : [],            // 라벨은 여러개 지정 될 수 있으니 
        activation : false,     // 활성화 여부 
        favorite : false,       // 기본 값 fasle 
    }
}

const updateFont = (_id, done) => {

    db.find({ category : _id }, (err, docs) => {
        if (docs && docs.length) {
            done && done();
            return; 
        }

        console.log(err, docs);
        directoryDB.findOne({ _id }, (err2, category) => {
            console.log(err2, category);
            const hash = createMd5(category.directory); 
            const total = (hash.files) ? hash.files.length : 0;
            let count = 0;  

            console.log(hash, total);

            if (total === 0) {
                done && done();
                return;
            }

            hash.files.forEach((file) => {
                createFont(initializeFontFile(file, _id), function () {
                    count++;
    
                    if (count === total) {
                        done && done();
                    }
                });
            })
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
    directoryDB.findOne({ type: 'library',  $or : [{library}, { _id : library }]  }, (err, doc) => {
        if (doc) {

            if (!Array.isArray(filepath)) {
                filepath = [filepath]
            }

            doc.files = _.uniq(doc.files.concat(filepath));


            directoryDB.update({ 
                type: 'library', 
                $or : [{library}, { _id : library }] 
            }, { 
                $set: {   files: doc.files } 
            }, {multi : true }, function () {
                done && done(true);
            });
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


const update = (directory, type, done) => {
    directoryDB.findOne({ directory, type }, (err, doc) => {
        if (doc) {
            done && done(doc._id);
        } else {
            // 디렉토리 정보 다시 입력 
            directoryDB.insert({    
                directory,
                type,
                name: path.basename(directory),
            }, (err2, category) => {
                console.log(category)
                // 전체 폰트정보 업데이트 
                updateFont(category._id, () => {
                    done && done (category._id);
                })                
            
            });
        }
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
        return a.font.currentFamilyName <  b.font.currentFamilyName ? -1 : 1;
    })

    let filteredList = [];
    let keys = {};

    files.forEach((f) => {
        if (!keys[f.font.familyName]) {
            filteredList[filteredList.length] = f;
            keys[f.font.familyName] = f; 
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

const getFilesSub = (directoryOrId, callback) => {
    directoryDB.findOne({ $or : [
        {directory : directoryOrId},
        { _id : directoryOrId }
    ] }, (err, category) => {
        if (category) {
            db.find({ category : category._id}, (err2, files) => {
                callback && callback(filterFiles(files));
            })
        } else {
            callback && callback ([]);
        }

    })    
}

const getFiles = (directoryOrId, callback) => {
    directoryDB.findOne({ $or : [
        {directory : directoryOrId},
        { _id : directoryOrId }
    ] }, (err, category) => {
        console.log(category);

        if (category) {
            db.find({ category : category._id}, (err2, files) => {

                if (files.length) {
                    callback && callback(filterFiles(files));
                } else {

                    updateFont(category._id, () => {
                        getFilesSub(category._id, callback)
                    })
                }
            })
        } else {
            callback && callback ([]);
        }

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

const getCssInfo = (files, callback) => {

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

const getAllDirectories = (docs) => {
    docs = common.getSystemFolders().concat(docs);

    return docs; 
}

const fontdb = {

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

    /* get css information */ 
    getCssInfo,
    
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