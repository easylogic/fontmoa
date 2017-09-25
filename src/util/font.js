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

const downloadFile = (link, callback) => {
    let targetFile = path.resolve(font_root, path.basename(link));

    if (isZipFile(targetFile) || isFontFile(targetFile)) {

    } else {
        targetFile = path.resolve(font_root, Date.now() + ".zip");
    }

    if (isZipFile(targetFile) || isFontFile(targetFile)) {
        // copy 하기 
        download.downloadFile(link, targetFile, () => {
            //console.log('download file', targetFile);
            if (isZipFile(targetFile)) { // 과연 압축 파일을 받아서 압축을 풀어주는게 맞을까? 
                const dir  = path.resolve(path.dirname(targetFile), path.basename(targetFile, ".zip"))
                let files = [];         
                extract(targetFile, {
                    dir,
                    onEntry : (entry, zipFile) => {

                        if (entry.fileName && isFontFile(entry.fileName)) {
                            const fullpath = path.resolve(dir, entry.fileName);
                            //console.log(fullpath);

                            files.push(fullpath);
                        }

                    }
                }, function (err) {

                    db.updateFontFile(files, () => {
                        //console.log('updated font file', files);
                        
                        fs.unlink(targetFile, () => {
                            callback && callback();
                        });
                    })

                   
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