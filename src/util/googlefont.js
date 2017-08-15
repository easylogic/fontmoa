import GoogleFont  from '../resources/api/googlefont'

const fs  = window.require('fs');

const google_font_api = 'https://www.googleapis.com/webfonts/v1/webfonts?key=';
const font_list_file = 'data/google-font-list.json'

const getGoogleFontListURL = () => {
    return google_font_api + GoogleFont.API_KEY;
}

const saveGoogleFontList = (json, callback) => {
    if (fs.existsSync(font_list_file)) {
        callback && callback();
    } else {
        fs.writeFile('data/google-font-list.json', JSON.stringify(json), (err) => {
            if (err) console.log(err);
            callback && callback();
        })
    }

}

const analysisFont = (json) => {
    let category = new Set();
    let language = new Set();

    json.items.forEach((font) => {
        category.add(font.category)
        font.subsets.forEach((subset) => { 
            language.add(subset);
        })
    })

    json.categories = Array.from(category)
    json.languages = Array.from(language).sort()

    return json;
}

const loadGoogleFontList = (callback) => {
    const fontUrl = getGoogleFontListURL();

    fetch(fontUrl)
        .then(res => res.json())
        .then(json => saveGoogleFontList(analysisFont(json), callback))
}

const getGoogleFontList = (callback) => {
    fs.readFile(font_list_file, (err, data) => {
        if (err) {
            callback && callback ({items : []})
        } else {
            callback && callback (JSON.parse(data + ""))
        }

    })
}

export default {
    loadGoogleFontList,
    getGoogleFontList,
}