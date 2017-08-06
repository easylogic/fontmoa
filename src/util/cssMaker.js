
const fs = window.require('fs');
const path = window.require('path');

const changeExt = (file, ext) => {
    let arr = file.split(".");
    arr[arr.length-1] = ext;

    return arr.join('.');
}

const createCssDir = (dirname) => {
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

const createFontCss = (realpath, font) => {
    const obj = path.parse(realpath);

    let cssname = changeExt(obj.base, 'css');

    const cssdir = path.join('css', './' + obj.dir);
    const fontdir = path.join('fonts', './' + obj.dir);
    const csspath = path.resolve(path.join('public', cssdir), cssname);
    const fontpath = path.resolve(path.join('public', fontdir), obj.base);    
    if (fs.existsSync(csspath)) {
        // css 파일이 생성된 상태면 더 이상 생성하지 않는다. 
        //return; 
    }


    createCssDir(path.join('public', cssdir));
    createCssDir(path.join('public', fontdir));

    const ext = obj.ext.split('.').pop();

    let fonttype = 'truetype';

    switch(ext) {
        case 'ttf': fonttype = 'truetype'; break; 
        case 'otf': fonttype = 'opentype'; break; 
        default: break; 
    }

    const fontFamily = font.familyName;


    const data = `
@font-face {
    font-family: '${fontFamily}';
    src: url('/fonts/${realpath}') format('${fonttype}');
}
`;
    fs.writeFileSync(csspath, data);
    fs.writeFileSync(fontpath, fs.readFileSync(realpath));

    return {
        csspath : path.join(cssdir, cssname),
        fontpath : path.join(fontdir, obj.name),
        fontFamily,
        realpath,
        fonttype
    }
}

export default {
    createFontCss
}