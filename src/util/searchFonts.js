import fonts from '../resources/fonts'

/* filtering function */

const filterText = (font, filter) => {
    const result = ( filter.text.test(font.type) || filter.text.test(font.family) ||  filterCategory(font, filter))
    return result; 
}

/*
const filterWeight = (font, filter) => {
    const weight = filter.weight === 400 ? 'regular' : filter.weight;

    if (!font.variants) { return true; }

    return font.variants.some((v) => v.indexOf(weight) > -1) 
}
*/
const filterCategory = (font, filter) => { 

    const text = (font.category || font.name || "").toLowerCase();

    const result = filter.text.test(text);
    return result; 
}

/* searching function */ 

const search = (searchFilter, callback) => {

    let results = [];

    Object.keys(fonts).forEach((key) => {
        const fontList = fonts[key];

        results = results.concat(fontList.items.filter((font) => {
            font.type = fontList.type; 
            return searchFilter.funcs.some((filtering) => {
                return filtering(font, searchFilter.filter)
            })
        }))
    })

    callback && callback(results);
}

const createSearchFilter = (filter) => {
    let searchFilter = {filter: filter, funcs : []}

    if (filter.text) {
        filter.text = new RegExp(filter.text, "ig");
        searchFilter.funcs.push(filterText)
    }

    //if (filter.weight) {
       // searchFilter.funcs.push(filterWeight)
    //}

    if (filter.category) {
        searchFilter.funcs.push(filterCategory)
    }    

    return searchFilter;
}

const searchFonts = (filter, callback) => {

    const searchFilter = createSearchFilter(filter); 

    search(searchFilter, (files) => {
        callback && callback(files);
    })

}

export default {
    searchFonts 
}