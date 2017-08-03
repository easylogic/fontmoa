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
            { name : '시스템 폴더', directory : '/Library/Fonts'}
        ];
      case "win32" : 
        return [
          { name : '시스템 폴더', directory : 'c:\\Windows\\Fonts'}
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
        baseline = 0; 
    }


    ["ascent", "descent", "baseline", "lineGap", "capHeight", "xHeight"].forEach((field) => {
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

const common = {
    getSystemFolders,
    getFontFamilyCollect,
    caculateFontUnit,
    getFontStyleCollect,
}

export default common