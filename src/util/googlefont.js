import db from './db'
import download from './download'
import common from './common'
import func from './func'
import google_font_list from '../resources/fonts/google-font-list.json'
import google_font_early_access_list from '../resources/fonts/google-font-early-access-list.json'

const fs  = window.require('fs');
const path = window.require('path')
const uuidv1 = window.require('uuid/v1')
const extract = window.require('extract-zip')

const font_root = common.getLocalFolder().directory;

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

const downloadGoogleFont = (font, callback) => {
    const font_dir = path.join(font_root);
    common.createDirectory(path.dirname(path.join(font_dir, '.temp')));

    const keys = Object.keys(font.files);

    func.seq(keys, (key, next) => {
        const link = font.files[key];
        const targetFile = path.resolve(font_dir, font.family.replace(/ /g, '_') + '_' + key + '.ttf');

        download.downloadFile(link, targetFile, () => {
            console.log('downloaded', targetFile);
            db.updateFontFile(targetFile, next)
        })

    }, callback)
}

const downloadAllGoogleFont = (progress, callback) => {
    getGoogleFontList((list) => {


        func.seq(list.items, (font, next) => {
            progress && progress ('start', font);
            downloadGoogleFont(font, () => {
                progress && progress ('end', font);
                next();
            })
        }, callback)
    })
}


const downloadEarlyAccess = (link, callback) => {
    common.createDirectory(path.dirname(path.join(font_root, '.temp')));
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
        func.seq(list.items, (font, next) => {
            progress && progress (font);
            downloadEarlyAccess(font.downloadUrl, next)            
        }, callback)
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