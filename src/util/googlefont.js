import GoogleFont  from '../resources/api/googlefont'
import request from './request'

const fs  = window.require('fs');

const google_font_api = 'https://www.googleapis.com/webfonts/v1/webfonts?key=';
const google_font_early_access = 'https://fonts.google.com/earlyaccess';
const font_list_file = 'data/google-font-list.json'
const early_access_font_file = 'data/google-font-early-access-list.json'

const getGoogleFontListURL = () => {
    return google_font_api + GoogleFont.API_KEY;
}

const getGoogleFontEarlyAccessURL = () => {
    return google_font_early_access;
}


const analysisEarlyAccessFont = (text) => {
    let $div = document.createElement('div');
    $div.innerHTML = text; 

    const items = [...$div.querySelectorAll('.early-access-contents-main > ol > li')].map(($li) => {
        let fontObj = { type : 'early-access'}

        const $dom = $li.querySelector("h2");

        const family = $dom.id || $dom.getAttribute('name');


        fontObj.family = family.split('+').join(' ');
        fontObj.name = $dom.textContent;
        fontObj.description = $li.querySelector('p').innerHTML.trim();

        if ($li.querySelector('h3')) {
            fontObj.cssImport = $li.querySelector('h3').nextElementSibling.textContent.trim();
            fontObj.cssUrl = fontObj.cssImport.match(/\((.*)\)/i)[1];
        }
        
        // check link 
        [...$li.querySelectorAll('a[target]')].map((a) => {
            const link = a.getAttribute('href');
            const text = a.textContent;

            return { link, text}
        }).forEach((url) => {
            if (url.text.indexOf('License') > -1) {
                fontObj.licenseUrl = url.link;
                fontObj.license = url.text;
            } else {
                fontObj.downloadUrl = url.link;
            }
        })


        return fontObj; 
    }).sort((a, b) => {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    })

    return {items}; 
}

const saveGoogleFontEarlyAccessList = (json, callback) => {
    if (fs.existsSync(early_access_font_file)) {
        callback && callback();
    } else {
        fs.writeFile(early_access_font_file, JSON.stringify(json), (err) => {
            if (err) console.log(err);
            callback && callback();
        })
    }


    callback && callback();
}

const loadGoogleFontEarlyAccessList = (callback) => {
    const fontUrl = getGoogleFontEarlyAccessURL();
    request.fetch(fontUrl, (text) => {
        saveGoogleFontEarlyAccessList(analysisEarlyAccessFont(text), callback)
    })
}

const saveGoogleFontList = (json, callback) => {
    if (fs.existsSync(font_list_file)) {
        callback && callback();
    } else {
        fs.writeFile(font_list_file, JSON.stringify(json), (err) => {
            if (err) console.log(err);
            callback && callback();
        })
    }

}

const analysisFont = (json) => {
    let category = new Set();
    let language = new Set();

    json.items.forEach((font, index) => {
        json.items[index].type = 'google';
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

const getGoogleFontEarlyAccessList = (callback) => {
    fs.readFile(early_access_font_file, (err, data) => {
        if (err) {
            callback && callback ({items : []})
        } else {
            callback && callback (JSON.parse(data + ""))
        }

    })
}

const load = (callback) => {
    loadGoogleFontList(() => {
        getGoogleFontList((json) => {
            loadGoogleFontEarlyAccessList(() => {
                getGoogleFontEarlyAccessList(({items}) => {
                    json.earlyAccessList = items;
                    callback && callback(json);
                })
            })
        })
    });
}

export default {
    loadGoogleFontList,
    getGoogleFontList,
    loadGoogleFontEarlyAccessList,
    getGoogleFontEarlyAccessList,
    load,
}