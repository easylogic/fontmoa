import GoogleFont  from '../resources/api/googlefont'
import request from './request'

const fs  = window.require('fs');
const path = window.require('path')
const uuidv1 = window.require('uuid/v1')
const extract = window.require('extract-zip')

const google_font_api = 'https://www.googleapis.com/webfonts/v1/webfonts?key=';
const google_font_early_access = 'https://fonts.google.com/earlyaccess';
const font_list_file = 'data/google-font-list.json'
const early_access_font_file = 'data/google-font-early-access-list.json'

const google_font_dir = 'data/googlefont/main-font'
const early_access_dir = 'data/googlefont/early-access'

const getGoogleFontListURL = () => {
    return google_font_api + GoogleFont.API_KEY;
}

const getGoogleFontEarlyAccessURL = () => {
    return google_font_early_access;
}


const analysisEarlyAccessFont = (text) => {
    let $div = document.createElement('div');
    $div.innerHTML = text; 

    const items = [...$div.querySelectorAll('.early-access-contents-main > ol > li')].map(($li) => {
        let fontObj = { }

        const $dom = $li.querySelector("h2");

        const family = $dom.id || $dom.getAttribute('name');


        fontObj.family = family.split('+').join(' ');
        fontObj.name = $dom.textContent;
        fontObj.description = $li.querySelector('p').innerHTML.trim();

        if ($li.querySelector('h3')) {
            fontObj.cssImport = $li.querySelector('h3').nextElementSibling.textContent.trim();
            fontObj.cssUrl = fontObj.cssImport.match(/\((.*)\)/i)[1];
        }
        
        // check link 
        [...$li.querySelectorAll('a[target]')].map((a) => {
            const link = a.getAttribute('href');
            const text = a.textContent;

            return { link, text}
        }).forEach((url) => {
            if (url.text.indexOf('License') > -1) {
                fontObj.licenseUrl = url.link;
                fontObj.license = url.text;
            } else {
                fontObj.downloadUrl = url.link;
            }
        })

        return fontObj; 
    }).sort((a, b) => {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    })

    return {items}; 
}

const saveGoogleFontEarlyAccessList = (json, callback) => {
    if (fs.existsSync(early_access_font_file)) {
        callback && callback();
    } else {
        fs.writeFile(early_access_font_file, JSON.stringify(json), (err) => {
            if (err) console.log(err);
            callback && callback();
        })
    }


    callback && callback();
}

const loadGoogleFontEarlyAccessList = (callback) => {
    const fontUrl = getGoogleFontEarlyAccessURL();
    request.fetch(fontUrl, (text) => {
        saveGoogleFontEarlyAccessList(analysisEarlyAccessFont(text), callback)
    })
}

const saveGoogleFontList = (json, callback) => {
    if (fs.existsSync(font_list_file)) {
        callback && callback();
    } else {
        fs.writeFile(font_list_file, JSON.stringify(json), (err) => {
            if (err) console.log(err);
            callback && callback();
        })
    }

}

const analysisFont = (json) => {
    let category = new Set();
    let language = new Set();

    json.items.forEach((font, index) => {
        category.add(font.category)
        font.subsets.forEach((subset) => { 
            language.add(subset);
        })
    })

    json.categories = Array.from(category)
    json.languages = Array.from(language).sort()

    return json;
}

const loadGoogleFontList = (callback) => {
    const fontUrl = getGoogleFontListURL();

    fetch(fontUrl)
        .then(res => res.json())
        .then(json => saveGoogleFontList(analysisFont(json), callback))
}

const getGoogleFontList = (callback) => {
    fs.readFile(font_list_file, (err, data) => {
        if (err) {
            callback && callback ({items : []})
        } else {
            callback && callback (JSON.parse(data + ""))
        }

    })
}

const getGoogleFontEarlyAccessList = (callback) => {
    fs.readFile(early_access_font_file, (err, data) => {
        if (err) {
            callback && callback ({items : []})
        } else {
            callback && callback (JSON.parse(data + ""))
        }

    })
}

const load = (callback) => {
    loadGoogleFontList(() => {
        getGoogleFontList((json) => {
            loadGoogleFontEarlyAccessList(() => {
                getGoogleFontEarlyAccessList(({items}) => {
                    json.earlyAccessList = items;
                    callback && callback(json);
                })
            })
        })
    });
}


const createDir = (dirname) => {
    dirname.split(path.sep).reduce((prevDir, dir, index, array) => {
        const temppath = path.resolve(prevDir, dir);
        console.log(temppath);
        if (fs.existsSync(temppath)) {
            // NOOP 
        } else {
            fs.mkdirSync(temppath, 0o777);
        }
        return temppath;
    }, '');
}

const downloadGoogleFont = (font, callback) => {
    const font_dir = path.join(google_font_dir);
    createDir(path.dirname(path.join(font_dir, '.temp')));

    const total = font.files.length; 
    let count = 0; 
    Object.keys(font.files).forEach(v => {
        const link = font.files[v];
        const targetFile = path.resolve(font_dir, font.family.replace(/ /g, '_') + '_' + v + '.ttf');
        request.downloadFile(link, targetFile, () => {
            count++;

            if (count === total) {
                callback && callback();
            }
        })
    })
}

const downloadEarlyAccess = (link, callback) => {
    createDir(path.dirname(path.join(early_access_dir, '.temp')));
    const targetFile = path.resolve(early_access_dir, uuidv1() + '.zip');

    // copy 하기 
    request.downloadFile(link, targetFile, () => {
        console.log(targetFile);

        // 여기는 압축 풀어줘야할 것 같음. 
        extract(targetFile, {dir: path.dirname(targetFile)}, function (err) {
            fs.unlink(targetFile, () => {
                callback && callback();
            });

        })
    })
}

export default {
    loadGoogleFontList,
    getGoogleFontList,
    loadGoogleFontEarlyAccessList,
    getGoogleFontEarlyAccessList,
    load,
    downloadGoogleFont,
    downloadEarlyAccess,
}