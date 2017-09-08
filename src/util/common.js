import Pangram from '../resources/pangram'

const os = window.require('os') 
const fs = window.require('fs') 
const path = window.require('path') 

const { app, shell } = window.require('electron').remote;

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

const activation = (file, isActive) => {
    const systemFolder = getSystemFolders().filter(f => f.type === 'system')[0];
    const systemDirectory = systemFolder.directory; 
    const fileName = path.basename(file);
    console.log(systemDirectory);
    const tempFontFile = path.resolve(systemDirectory, fileName);
    console.log(tempFontFile, file);
    if (fs.existsSync(tempFontFile) === false) {    // 존재하지 않으면 파일 링크 
       copy(file, tempFontFile, (err) => {
           console.log(err);
       })
    } 

    // 시스템 폰트에 원래 있던 파일인가? 
    // 외부 파일인가? 
    // 외부 파일이면 activation 을 실행한다. 
    // activation 을 실행하기 전 font 파일이 설치되어 있는지부터 확인한다. 
    // 설치되어있으면 패스 
    // 설치되어 있지 않으면 font 파일을  fonts/  시스템 디렉토리로 카피한다. (symbolic link 로 할까?)
    // isActive 가 true 이면 active 
    // isActive 가 false 이면 inactive 
    // 상태를 변경하는 시점은 언제인가? 


}

const common = {
    activation,
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