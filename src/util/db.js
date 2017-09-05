import common from './common'
import cssMaker from './cssMaker'
import cache from './cache'
import searchFonts from './searchFonts'

const fs = window.require('fs');
const path = window.require('path');
const fontkit = window.require('fontkit');
const DataStore  = window.require('nedb');
const { remote } = window.require('electron'); 

// locale 
const locale = remote.app.getLocale()

const fontDB = new DataStore({ filename : 'data/font.data' });
fontDB.loadDatabase((err) => {});

const directoryDB = new DataStore({ filename : 'data/directory.data' });
directoryDB.loadDatabase((err) => {})

// cache db key list 
const CACHE_LABEL_KEY = 'label';

// font extenstion
const exts = ['.ttf', '.otf', /*'.woff', */'.ttc'];

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

const getCurrentLanguage = (fontItem) => {
    let currentLanguage = fontItem.language.filter((l) => {
        return l !== 'en' && l !== '0-0'
    }).pop() || 'en';

    if (currentLanguage !== locale) {
        currentLanguage = fontItem.language.includes(locale) ? locale : 'en';
    }

    return currentLanguage;
}

const insertFont = (font, fontObj, done) => {

    try {

        const fontItem = {
            postscriptName : (font.name ? font.postscriptName : ''),
            fullName: (font.name ? font.fullName : ''),
            familyName: (font.name ? font.familyName : ''),
            subfamilyName: (font.name ? font.subfamilyName : ''),
            nameList : font.nameList || [],
            name : getNames(font.name || {}),
            language : getLanguage(font.name || {}),
            weight: (font['OS/2'] ? font['OS/2'].usWeightClass : 400),
        }
    
        const  currentLanguage = fontItem.currentLanguage = getCurrentLanguage(fontItem)

        if (fontItem.name.fontFamily) {
            const familyName = fontItem.name.fontFamily[currentLanguage] || fontItem.familyName;    
    
            fontItem.currentFamilyName = familyName;
        }
    
    
        if (fontItem.subfamilyName) {
            const sub = fontItem.subfamilyName.toLowerCase();
            if (sub.includes('italic')) {
                fontItem.italic = true;
            }
        
            if (sub.includes('bold')) {
                fontItem.bold = true;
            }
        }
    
    
        fontItem.collectStyle = common.getFontStyleCollect(fontItem);
    
        fontObj.font = fontItem; 

        fontDB.findOne({file : fontObj.file}, (err, doc) => {

            if (doc) {
                fontDB.update( {file : fontObj.file},  {  $set : { font : fontItem, updateAt : new Date() } }, (err, docs) => {
                    console.log('update font', fontObj.file);                    
                    done && done();
                });
            } else {
                fontDB.insert( fontObj , (err) => {
                    console.log('add font', fontObj.file);                    
                    done && done();
                });
            }

        })


    } catch (e) {
        console.log(e);
        return done && done();
    }

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
                console.error(err);
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

const getFileListForDirectory = (directory, type) => {
    if (fs.existsSync(directory) === false) {
        fs.mkdirSync(directory);

        return { }
    }

    let files = [];
    
    try {
        files = fs.readdirSync(directory);
    } catch (e) {
        console.log(e.message);
    }
        
    let results = [];

    files.forEach(f => {
        const destFile = path.resolve(directory, f);
        const stat = fs.statSync(destFile);
        
        if (stat.isDirectory()) {
            const sub = getFileListForDirectory(destFile);
            results.push(...sub.files);
        } else {
            results.push(destFile);
        }
    })

    results = results.filter((f) => {
        return exts.includes(path.extname(f));
    });

    return { files : results }
}

const initializeFontFile = (file) => {
    return {
        file,                   // 이건 font 파일 패스 
        labels : [],            // 라벨은 여러개 지정 될 수 있으니 
        activation : false,     // 활성화 여부 
        favorite : false,       // 기본 값 fasle 
    }
}


const updateFontFile = (files, done) => {

    if (!Array.isArray(files)) {
        files = [files];
    }

    let startIndex = -1; 


    const startUpdateFont = () => {
        const file = files[startIndex];
        if (!file) {
            done && done();
            return; 
        }

        createFont(initializeFontFile(file), () => {
            nextFont();
        });
    }

    const nextFont = () => {
        startIndex++;

        startUpdateFont();
    }

    nextFont();
}
    
const addDirectory = (directory, done) => {
    const name = path.basename(directory);

    directoryDB.update({ directory }, {type: 'user', directory, name}, { upsert : true}, () => {
        refreshDirectory(directory, done);
    })
} 

const toggleFavorite = (fileOrId, isAdd, done) => {
    fontDB.update({ 
        $or : [ 
            {file: fileOrId}, 
            { _id : fileOrId } 
        ] 
    }, { 
        $set :{ 
            favorite : isAdd === true
        } 
    }, (err, count) => {
        done && done(count);
    })
} 

const toggleActivation = (fileOrId, isActive, done) => {
    fontDB.update({ 
        $or : [ 
            { file: fileOrId}, 
            { _id : fileOrId } 
        ] 
    }, { 
        $set :{ 
            activation : isActive === true
        } 
    }, (err, count) => {

        // os 별로 font activation 을 구현한다. 

        done && done(count);
    })
} 

// 라벨을 한번에 업데이트 해보자. 
const updateLabels = (fileOrId, labels = [], done) => {
    fontDB.update({ 
        $or : [ 
            {file: fileOrId}, 
            { _id : fileOrId } 
        ] 
    }, { 
        $set :{ labels : labels } 
    }, {}, (err, count) => {

        // 업데이트는 종료 시키고 
        done && done(count);

        // 캐쉬는 내부적으로 따로 만들고 있고 
        createLabelsCache (labels)

    })
} 

// 흠 캐쉬를 무조건 새로 만들어야하나? 
const createLabelsCache = (labels, callback) => {
    cache.addToSet(CACHE_LABEL_KEY, labels, (err) => {
        callback && callback(err)
    })
}

// 전체 label 을 다시 생성 
const refreshLabelsCache = (callback) => {
    let newLabels = new Set();

    fontDB.find({}, { labels : 1}, (err, docs) => {
        docs.forEach(doc => {
            if (doc.labels) {
                doc.labels.forEach((label) => {
                    newLabels.add(label);
                })
            }
            
        })

        cache.set(CACHE_LABEL_KEY, [...newLabels], (err) => {
            callback && callback (err);
        })
    })

}
// when refresh directory 
// one. all files in directory are update font information. 
// two. file that not exists in  font db  is will remove. 
// three. font status is remain.  
const refreshDirectory = (directory, done) => {

    const ret = getFileListForDirectory(directory); 

    const total = (ret.files) ? ret.files.length : 0;
    let count = 0;  

    if (total === 0) {
        done && done();
        return;
    }

    ret.files.forEach((file) => {
        updateFontFile(file, () => {
            count++;
            
            if (count === total) {
                done && done();
            }
        })
    })

}


const getDirectories = (callback) => {
    directoryDB.find({ }, (err, docs) => {
        docs.sort(function(a, b) {
            return a.name <  b.name ? -1 : 1;
        })
        callback && callback(docs);
    })
}


const filterFiles = (files) => {
    files.sort(function(a, b) {
        return a.font.currentFamilyName <  b.font.currentFamilyName ? -1 : 1;
    })

    return files;
}

const removeDirectory = (directory, callback) => {
    directoryDB.remove({ type : 'user', $or : [ {directory}, {_id : directory}  ]  }, { multi : true}, (err, num) => {
        callback && callback();
    })
}


const createDBFilter = (filter) => {
    const dbFilter = { $and : [] }
    

    if (filter.favorite) {
        dbFilter.$and.push({ 
            favorite : true 
        })
    }

    if (filter.text) {
        const reg = new RegExp(filter.text, "ig");

        dbFilter.$and.push({ $or : [
            { "file" : reg },
            { "font.familyName" : reg },
            { "font.currentFamilyName" : reg },
            { 'labels' : reg }
        ]})
    }

    return dbFilter;
}

const searchFiles = (filter, callback) => {

    const dbFilter = createDBFilter(filter)

    fontDB.find(dbFilter, (err2, files) => {
        searchFonts.searchFonts(filter, (fontList) => {
            const resultFiles = filterFiles(files || []).concat(fontList);
            callback && callback(resultFiles);
        })
    })

}


const getFavoriteCount = (callback) => {
    fontDB.count({ favorite : true}, (err, count) => {
        callback && callback(count || 0);
    })
}


const findOne = (path, callback) => {
    fontDB.findOne({ 'item.path' : path}, (err, doc) => {
        if (err) {
            doc = {};
        }

        callback && callback(doc);        
    })
}

const initFontDirectory = (callback) => {
    
    const folders = common.getSystemFolders();

    const done = () => {
        callback && callback();
    }

    cache.get('is.loaded.system.dir', (result) => {
        if (!result) {

            const total = folders.length; 
            let count = 0; 

            folders.forEach(it => {
                refreshDirectory(it.directory, (categoryId) => {
                    count++;

                    if (count === total) {
                        cache.set('is.loaded.system.dir', true, done);
                    }
                })
            })
        } else {
          done();
        }
    })
}

const updateFiles = (files, done) => {
    if (!Array.isArray(files)) {
        files = [files];
    }

    let startIndex = -1; 

    const startFunction = () => {
        const destFile = files[startIndex];

        if (!destFile) {
            done && done();
            return;
        }

        const stat = fs.statSync(destFile)

        if (stat.isDirectory()) {
            addDirectory(destFile, (_ => {
                nextFunction();
            }))
        } else {
            // 임의로 file 을 가지고 왔을 때  local font 디렉토리로 가지고(copy) 와야 할까? 
            updateFontFile(destFile, () => {
                nextFunction();
            })
        }
    }

    const nextFunction = () => {
        startIndex++;

        startFunction();
    }

    nextFunction();
}

const db = {

    fontInfo,
    glyfInfo,
    findOne,

    /* add user resource */
    toggleActivation,
    toggleFavorite,
    updateLabels,

    /* create, refresh labels */
    createLabelsCache,
    refreshLabelsCache,

    /* get count */
    getFavoriteCount,

    /* get user folders */

    getDirectories,
    
    /* search files */
    searchFiles,

    /* update  font information */
    initFontDirectory,
    refreshDirectory,
    addDirectory,
    updateFontFile,    

    /* update  dropped files  */
    updateFiles,

    /* remove resource */
    removeDirectory,

}

export default db