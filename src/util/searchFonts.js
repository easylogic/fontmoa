import fonts from '../resources/fonts'

/* filtering function */

const filterText = (font, filter) => {
    return ( font.family.toLowerCase().indexOf(filter.text) > -1 ||  filterCategory(font, filter))
}

const filterWeight = (font, filter) => {
    const weight = filter.weight === 400 ? 'regular' : filter.weight;

    if (!font.variants) { return true; }

    return font.variants.some((v) => v.indexOf(weight) > -1) 
}

const filterCategory = (font, filter) => { 

    const text = (font.category || font.name || "").toLowerCase();

    return text.indexOf(filter.text) > -1;
}

/* searching function */ 

const search = (searchFilter) => {

    let results = [];

    Object.keys(fonts).forEach((key) => {
        const fontList = fonts[key];

        results = results.concat(fontList.items.map((font) => {
            return searchFilter.funcs.some((filtering) => {
                return filtering(font, searchFilter.filter)
            })
        }))
    })

    return results;
}

const createSearchFilter = (filter) => {
    let searchFilter = {filter: filter, funcs : []}

    if (filter.text) {
        searchFilter.funcs.push(filterText)
    }

    if (filter.weight) {
        searchFilter.funcs.push(filterWeight)
    }

    if (filter.category) {
        searchFilter.funcs.push(filterCategory)
    }    

    return searchFilter;
}

const searchFonts = (filter, callback) => {

    const searchFilter = createSearchFilter(filter); 

    search(searchFilter, (files) => {
        console.log('searchFonts', files);
        callback && callback(files);
    })

}

export default {
    searchFonts 
}