import download from './download'
import db from './db'

const fs  = window.require('fs');
const path = window.require('path')
const extract = window.require('extract-zip')
const mime = window.require('mime');

const font_root = 'data/fonts'

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
    'application/x-font-woff',
    'application/x-font-otf',
    'application/x-font-woff2',
]


const isZipFile = (file) => {
    const type = mime.lookup(file);    
    return zip_mime_list.includes(type)
}

const isFontFile = (file) => {
    const type = mime.lookup(file);
    console.log(type);
    return isZipFile(file) || font_mime_list.includes(type)
}

const downloadFile = (link, callback) => {
    const targetFile = path.resolve(font_root, path.basename(link));

    if (isFontFile(targetFile)) {
        // copy 하기 
        download.downloadFile(link, targetFile, () => {
            console.log('download file', targetFile);
            if (isZipFile(targetFile)) { // 과연 압축 파일을 받아서 압축을 풀어주는게 맞을까? 
                const dir  = path.dirname(targetFile)                
                extract(targetFile, {
                    dir,
                    onEntry : (entry, zipFile) => {

                        if (entry.fileName && isFontFile(entry.fileName)) {
                            const fullpath = path.resolve(dir, entry.fileName);
                            console.log(fullpath);
                            db.updateFontFile(fullpath, () => {
                                console.log('updated font file', fullpath);
                            })
                        }

                    }
                }, function (err) {
                    fs.unlink(targetFile, () => {
                        callback && callback();
                    });
                })
            } else if (isFontFile(targetFile)) {
                db.updateFontFile(targetFile, () => {
                    callback && callback();
                })
            }
        })
    } else {



        callback && callback ();
    }
}

export default {
    downloadFile,
}