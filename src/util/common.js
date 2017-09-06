import Pangram from '../resources/pangram'

const os = window.require('os') 
const fs = window.require('fs') 
const path = window.require('path') 

const { app } = window.require('electron').remote;

const PROTOCOL_PREFIX = 'fontmoa'


const getFontFamilyCollect = (font) => {

    if (!font.name) return "";
    if (!font.familyName) return "";

    let fontList = {};

    fontList[font.familyName] = true;

    if (font.name) {
        for(const lang in font.name.fontFamily) {
            fontList[font.name.fontFamily[lang]] = true;
        }

        for(const lang in font.name.fullName) {
            fontList[font.name.fullName[lang]] = true;
        }
        
        for(const lang in font.name.postscriptName) {
            fontList[font.name.postscriptName[lang]] = true;
        }       
    }

    return Object.keys(fontList).map((f) => {
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

    if (font.weight) {
        style.fontWeight = font.weight
    } else if (font.bold) {
        style.fontWeight = 'bold'
    } else {
        style.fontWeight = 'normal'
    }

    return style; 
}


const getSystemFolders = () => {
    const platform = os.platform();

    return (SystemFolder[platform] || []).map(it => {
        it.directory = it.directory.replace('~', getPath('home'))
        return it; 
    } );
}

const getLocalFolder = () => {
    return getSystemFolders().filter(f => f.type === 'local')[0];
}

const isInSystemFolders = (path) => {
    const folders = getSystemFolders();

    const realpath = path.toLowerCase();
    const checkList = folders.filter((folder) => {
        return folder.type === 'system' && realpath.toLowerCase().indexOf(folder.directory.toLowerCase()) === 0;
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

const createDirectory = (dirname) => {
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

const getPath = (name) => {
    return app.getPath(name);
}

const getUserData = (lastPath) => {
    return path.join(getPath('userData'), lastPath || "");
}

const appDirectory = getUserData('fonts');
const SystemFolder = {
    "darwin" : [
         { name : 'fontmanager.category.system.folder.name', type : 'system', directory : '/Library/Fonts'},
         { name : 'Local Font', type : 'local', directory: appDirectory },
    ],
    "win32" : [
         { name : 'fontmanager.category.system.folder.name', type : 'system', directory : 'C:\\Windows\\Fonts'},
         { name : 'Local Font', type : 'local',  directory: appDirectory },
    ],
     "linux": [
         { name : 'fontmanager.category.system.folder.name', type : 'system', directory : '/usr/share/fonts'},        
         { name : 'Local Font', type : 'local',  directory: appDirectory },
    ]
 }

const common = {
    getPath,
    getUserData,
    getSystemFolders,
    getLocalFolder,
    isInSystemFolders,
    createDirectory,
    getFontFamilyCollect,
    caculateFontUnit,
    getFontStyleCollect,
    getPangramMessage,
    createSpecialChars,
    PROTOCOL_PREFIX,
}

export default common