const fs  = require('fs');
const path = require('path')
const fetch = require('node-fetch')
const cheerio = require('cheerio');

const API_KEY = "AIzaSyBbi99YleozD5UoXj9iLvAgb0_31TnFWtk";
const google_font_api = 'https://www.googleapis.com/webfonts/v1/webfonts?key=';
const google_font_early_access = 'https://fonts.google.com/earlyaccess';
const font_list_file = './src/resources/fonts/google-font-list.json'
const early_access_font_file = './src/resources/fonts/google-font-early-access-list.json'

const getGoogleFontListURL = () => {
    return google_font_api + API_KEY;
}

const getGoogleFontEarlyAccessURL = () => {
    return google_font_early_access;
}


const analysisEarlyAccessFont = (text) => {

    let $ = cheerio.load(text);

    let items = $(".early-access-contents-main > ol > li").map((i, el) => {
        let fontObj = { }
        
        const $li = $(el);
        const $dom = $li.find('h2');
        const family = $dom.attr('id') || $dom.attr('name');

        fontObj.family = family.split('+').join(' ');
        fontObj.name = $dom.text();
        fontObj.description = $li.find('p').html().trim();

        if ($li.find('h3').length) {
            fontObj.cssImport = $li.find('h3').next().text().trim();
            fontObj.cssUrl = fontObj.cssImport.match(/\((.*)\)/i)[1];
        }
        
        // check link 
        $li.find("a[target]").map((index, a) => {
            const $a = $(a);
            const link = $a.attr('href');
            const text = $a.text();

            return { link, text }
        }).get().forEach(({link, text}) => {
            if (text.indexOf('License') > -1) {
                fontObj.licenseUrl = link;
                fontObj.license = text;
            } else {
                fontObj.downloadUrl = link;
            }
        })

        return fontObj; 
    }).get().sort((a, b) => {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    })

    return { items }
}

const saveGoogleFontEarlyAccessList = (json, callback) => {

    fs.writeFile(early_access_font_file, JSON.stringify(json), (err) => {
        if (err) console.log(err);
        console.log('save google early access font : ', early_access_font_file);
        callback && callback();
    })

}

const loadGoogleFontEarlyAccessList = (callback) => {
    const fontUrl = getGoogleFontEarlyAccessURL();
    fetch(fontUrl)
        .then(res => res.text())
        .then(text => {
            saveGoogleFontEarlyAccessList(analysisEarlyAccessFont(text), callback)
        })
}

const saveGoogleFontList = (json, callback) => {
    fs.writeFile(font_list_file, JSON.stringify(json), (err) => {
        if (err) console.log(err);
        console.log('save google font : ', font_list_file);
        callback && callback();
    })
}

const analysisFont = (json) => {
    let category = new Set();
    let language = new Set();

    json.items.forEach((font, index) => {
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


const makeGoogleFontListData = (callback) => {
    loadGoogleFontList(() => {
        loadGoogleFontEarlyAccessList(callback)
    });
}


makeGoogleFontListData(() => {
    console.log('google font lists are downloaded.');
})
