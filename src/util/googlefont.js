import fontdb from './fontdb'
import download from './download'
import google_font_list from '../resources/fonts/google-font-list.json'
import google_font_early_access_list from '../resources/fonts/google-font-early-access-list.json'

const fs  = window.require('fs');
const path = window.require('path')
const uuidv1 = window.require('uuid/v1')
const extract = window.require('extract-zip')

const font_root = 'data/fonts'

const getGoogleFontList = (callback) => {
    callback && callback (google_font_list) 
}

const getGoogleFontEarlyAccessList = (callback) => {
    callback && callback (google_font_early_access_list) 
}

const load = (callback) => {
    getGoogleFontList((json) => {
        getGoogleFontEarlyAccessList(({items}) => {
            json.earlyAccessList = items;
            callback && callback(json);
        })
    })
}


const createDir = (dirname) => {
    dirname.split(path.sep).reduce((prevDir, dir, index, array) => {
        const temppath = path.resolve(prevDir, dir);
        if (fs.existsSync(temppath)) {
            // NOOP 
        } else {
            fs.mkdirSync(temppath);
        }
        return temppath;
    }, '');
}

const downloadGoogleFont = (font, callback) => {
    const font_dir = path.join(font_root);
    createDir(path.dirname(path.join(font_dir, '.temp')));

    const keys = Object.keys(font.files);
    let result = [];
    const total = keys.length; 


    keys.forEach(key => {

        const link = font.files[key];
        const targetFile = path.resolve(font_dir, font.family.replace(/ /g, '_') + '_' + key + '.ttf');
        
        download.downloadFile(link, targetFile, () => {
            //console.log('downloaded', targetFile);
            result.push(true);
            fontdb.updateFontFile(targetFile, () => {
                if (result.length === total) {
                    callback && callback();
                }
            })

        })

    })
}

const downloadAllGoogleFont = (progress, callback) => {
    getGoogleFontList((list) => {

        const total = list.items.length;

        list.items.forEach((font, index) => {
            progress && progress ('start', font, index, total);            


            ((f, i) => {
                downloadGoogleFont(f, () => {
                    progress && progress ('end', f, i + 1, total);
    
                    if (i + 1 === total) {
                        callback && callback();
                    }
                })
            })(font, index)

        })

    })
}


const downloadEarlyAccess = (link, callback) => {
    createDir(path.dirname(path.join(font_root, '.temp')));
    const targetFile = path.resolve(font_root, uuidv1() + '.zip');

    // copy 하기 
    download.downloadFile(link, targetFile, () => {

        // 여기는 압축 풀어줘야할 것 같음. 
        extract(targetFile, {dir: path.dirname(targetFile)}, function (err) {
            fs.unlink(targetFile, () => {
                callback && callback();
            });

        })
    })
}

const downloadAllEarlyAccess = (progress, callback) => {
    getGoogleFontEarlyAccessList((list) => {
        const total = list.items.length;
        let count = 0; 

        list.items.forEach((font) => {
            progress && progress (font);
            downloadEarlyAccess(font.downloadUrl, () => {
                count++;

                if (count === total) {
                    callback && callback();
                }
            })

        })
    })
}

export default {
    getGoogleFontList,
    getGoogleFontEarlyAccessList,
    load,
    downloadGoogleFont,
    downloadAllGoogleFont,
    downloadEarlyAccess,
    downloadAllEarlyAccess,
}