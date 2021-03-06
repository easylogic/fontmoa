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

const getPangramMessage = (lang) => {

    const message = Pangram[lang] || Pangram['en']

    return message;
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
         { name : 'User Font', type : 'local', directory: '~/Library/fonts/fontmoa' },         
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

const copy = (src, target, done) => {
    let wr = fs.createWriteStream(target);
    wr.on('error', (err) => {
        done(err);
    })

    wr.on('close' , () => {
        done();
    })

    let rs = fs.createReadStream(src);

    rs.on('error', (err) => {
        done(err);
    })

    rs.pipe(wr);
} 

const getURL  = (url) => {
    if (!url) return url; 
    if (url.includes('https://')) return url; 
    if (url.includes('http://')) return url;     

    return "http://" + url;
}

const common = {
    getURL,
    getPath,
    getUserData,
    copy,
    getSystemFolders,
    getLocalFolder,
    isInSystemFolders,
    createDirectory,
    getFontFamilyCollect,
    getFontStyleCollect,
    getPangramMessage,
    PROTOCOL_PREFIX,
}

export default common