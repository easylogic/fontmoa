const os = window.require('os') 

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
    switch (platform) {
      case "darwin" : 
        return [
            { name : 'fontmanager.category.system.folder.name', directory : '/Library/Fonts'}
        ];
      case "win32" : 
        return [
          { name : 'fontmanager.category.system.folder.name', directory : 'c:\\Windows\\Fonts'}
        ];
      default : 
        return []
    }
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
    let message = isShort ? "Ag" : "The quick brown fox jumps over the lazy dog";

    if (lang === 'ko') {
        message = isShort ? "한글" : "닭 잡아서 치킨파티 함."
    } else if (lang === 'zh') {
        message = "太阳";
    } else if (lang === 'ja') {
        message = isShort ? "いろ" : "いろはにほへとちりぬるを";
    } else if (lang === 'he') {
        message = isShort ? "רה" : 'דג סקרן שט בים מאוכזב ולפתע מצא לו חברה איך הקליטה';
    } else if (lang === 'ar') {
        message = "طارِ";        
    }

    return message;
}

const common = {
    getSystemFolders,
    getFontFamilyCollect,
    caculateFontUnit,
    getFontStyleCollect,
    getPangramMessage,
}

export default common