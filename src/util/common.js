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

const common = {
    getSystemFolders,
    getFontFamilyCollect,
}

export default common