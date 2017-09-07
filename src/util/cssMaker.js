import common from './common'

const fs = window.require('fs');
const path = window.require('path');

const css_root = common.getUserData('css');

const createCssDir = (dirname) => {
    if (fs.existsSync(dirname)) {
        // NOOP 
    } else {
        fs.mkdirSync(dirname, 0o777);
    }
}

createCssDir(css_root);

/**
 * font css 를 생성한다. 
 * css 파일을 매번 갱신해야할 필요가 있을까?  data uri 형태로 만들어도 될까? 
 * react 에서 css 가 변경되면 자동으로 새로 컴파일 되버려서 화면을 리로드 해버린다. 
 * css 를 datauri 형태로 바꾸자. 
 * 
 * @param {*} realpath 
 * @param {*} font 
 */
const createFontCss = (fontObj) => {
    const realpath = fontObj.file;
    const font = fontObj.font; 

    const obj = path.parse(realpath);

    let cssname = `${fontObj._id}.css`;

    const csspath = path.resolve(css_root, cssname);
    const isCss = fs.existsSync(csspath);

    if (isCss) {
        return {
            csspath : common.PROTOCOL_PREFIX + '://' + csspath,
        }
    }

    const ext = obj.ext.split('.').pop();

    let fonttype = 'truetype';

    switch(ext) {
        case 'ttf': fonttype = 'truetype'; break; 
        case 'otf': fonttype = 'opentype'; break; 
        case 'woff': fonttype = 'woff'; break;         
        default: break; 
    }

    const fontFamily = font.familyName;

    const css_fontpath = encodeURIComponent(encodeURIComponent(realpath));

    if (!isCss) {
        const data = `@font-face { font-family: '${fontFamily}'; src: url('${common.PROTOCOL_PREFIX}://${escape(css_fontpath)}') format('${fonttype}'); }`;
        fs.writeFileSync(csspath, data, { flag : 'w+'});

        //datauri.format('.css', data);        
    }


//    shell.openItem(fontpath);

    return {
        csspath : common.PROTOCOL_PREFIX + '://' + csspath,
        fontFamily,
        realpath,
        fonttype
    }
}

const loadCss = (css) => {
    if (!document.getElementById(css.csspath)) {
        // css 로드 
        let link = document.createElement('link');
        link.id = css.csspath;
        link.rel = 'stylesheet';
        link.href =  css.csspath;
        document.head.appendChild(link);
    }
}

export default {
    createFontCss,
    loadCss
}