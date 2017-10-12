import download from './download'
import db from './db'
import common from './common'


const fs  = window.require('fs');
const path = window.require('path')
const extract = window.require('extract-zip')
const mime = window.require('mime');

const font_root = common.getLocalFolder().directory;

const zip_mime_list = [
    'application/zip',
    'application/gzip',    
]

const font_mime_list = [
    'font/ttf',
    'font/woff',
    'font/woff2',
    'font/otf',
    'font/collection',
    'application/x-font-ttf',
    'application/font-woff',
    'application/x-font-otf',
    'application/font-woff2',
]


const isZipFile = (file) => {
    const type = mime.lookup(file);    
    return zip_mime_list.includes(type)
}

const isFontFile = (file) => {
    const type = mime.lookup(file);
    return font_mime_list.includes(type)
}

const extractZipFile = (zipFile, targetDir, callback ) => {
    let files = [];      
    extract(zipFile, {
        dir: targetDir,
        onEntry : (entry, zipFile) => {

            //console.log(entry, zipFile);

            if (entry.fileName && isFontFile(entry.fileName)) {
                const fullpath = path.resolve(targetDir, entry.fileName);
                //console.log(fullpath);

                files.push(fullpath);
            }

        }
    }, function (err) {
        callback && callback(err, files);
    })
}

const downloadZipFile = (link, targetFile, callback) => {
    const target = targetFile; 
    download.downloadFile(link, target, () => {
        const targetDir = path.dirname(target);
        const targetBaseName = path.basename(target, ".zip");
        const fullDir  = path.resolve(targetDir, targetBaseName)

        extractZipFile(target, fullDir, (err, files) => {
            db.updateFontFile(files, () => {
                //console.log('updated font file', files);
                fs.unlink(target, callback);
            })
        });

    })
}

const downloadFontFile = (link, targetFile, callback ) => {
    // copy 하기 
    download.downloadFile(link, targetFile, () => {
        db.updateFontFile(targetFile,  callback)
    })
}

const downloadFile = (link, targetFileName, callback) => {
    let targetFile = path.resolve(font_root, targetFileName || path.basename(link));

    if (isZipFile(targetFile)) {
        downloadZipFile(link, targetFile, callback);
    } else if (isFontFile(targetFile)) {
        downloadFontFile(link, targetFile, callback);
    } else {
        callback && callback();
    }
}

export default {
    downloadFile,
}