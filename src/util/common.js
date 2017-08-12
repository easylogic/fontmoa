import Pangram from '../resources/pangram'
import SystemFolder from '../resources/systemfolder'

const os = window.require('os') 

const PROTOCOL_PREFIX = 'fontmoa'

const getFontFamilyCollect = (font) => {

    if (!font.familyName) return "";

    let fontList = [];

    //console.log(font);

    fontList.push(font.familyName);
//    fontList.push(font.fullName);
//    fontList.push(font.postscriptName);


    if (font.name) {
       // console.log(font.name)
        for(const lang in font.name.fontFamily) {
            fontList.push(font.name.fontFamily[lang]);
        }

        //for(const lang in font.name.preferredFamily) {
        //    fontList.push(font.name.preferredFamily[lang]);
        //}
        


        //for(const lang in font.name.uniqueSubfamily) {
        //    fontList.push(font.name.uniqueSubfamily[lang]);
        //}

        for(const lang in font.name.fullName) {
            fontList.push(font.name.fullName[lang]);
        }
        
        for(const lang in font.name.postscriptName) {
            fontList.push(font.name.postscriptName[lang]);
        }       
    }



    return fontList.map((f) => {
        // eslint-disable-next-line
        return f.replace(/\-/g, ' ');
    }).join(', ');
    
}


const getFontStyleCollect = (font) => {
    let style = {
        fontFamily: getFontFamilyCollect(font),
        
    }

    if (font.italic) {
        style.fontStyle = 'italic';
    }

    if (font.bold) {
        style.fontWeight = 'bold'
    } else {
        style.fontWeight = 'normal'
    }

    return style; 
}


const getSystemFolders = () => {
    const platform = os.platform();

    return SystemFolder[platform] || [];
}

const isInSystemFolders = (path) => {
    const folders = getSystemFolders();

    const realpath = path.toLowerCase();
    const checkList = folders.filter((folder) => {
        return realpath.indexOf(folder.directory) === 0;
    })

    return !!checkList.length;
}

const createSpecialChars = () => {
    return { 
        type : 'specialChars', 
        name: 'glyfmanager.fontlist.specialChars.title',                 
        files : [
            { 
                type : 'specialChars',
                currentFamilyName: 'glyfmanager.fontlist.specialChars.title', 
                item : { path : ''},
                collectStyle : {
                    fontFamily : ''
                }
            }
        ]
    };
}

const caculateFontUnit = (font) => {

    let pos = {};
    const height = font.ascent + Math.abs(font.descent);
    let baseline = (font.ascent / height) * 100;
    //const lowUnit = 100 - baseline;

    if (isNaN(baseline)) {
        return pos;
    }


    ["ascent", "descent", "baseline", "capHeight", "xHeight"].forEach((field) => {
        if (font[field]  > 0)  {
            pos[field] = ((font.ascent - font[field]) / font.ascent) * 100;
        } else if (font[field] < 0) {
            pos[field] = ((font.ascent + Math.abs(font[field])) / height) * 100;
        } else if (field === 'baseline') {
            pos[field] = baseline; 
        }
    })

    return pos; 
}

const getPangramMessage = (lang, isShort) => {

    const message = Pangram[lang] || Pangram['en']

    return message[isShort ? 'short' : 'long'];
}

const common = {
    getSystemFolders,
    isInSystemFolders,
    getFontFamilyCollect,
    caculateFontUnit,
    getFontStyleCollect,
    getPangramMessage,
    createSpecialChars,
    PROTOCOL_PREFIX,
}

export default common