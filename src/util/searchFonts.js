import fonts from '../resources/fonts'

/* filtering function */

const filterType = (font, filter) => {

    const result = (filter.type === font.type);
    return result; 
}

const filterText = (font, filter) => {
    const result = ( 
        filter.text.test(font.family) || 
        filter.text.test(font.name) ||  
        filter.text.test(font.category) ||
        filterLabels(font, filter)
    );

    return result; 
}

const filterLabels = (font, filter) => {

    if (!font.labels) return false; 
    if (!font.labels.length) return false; 

    return font.labels.some((label) => filter.text.test(label));
}

const filterWeight = (font, filter) => {
    const weight = filter.googleFontSearch.weight === 400 ? 'regular' : filter.googleFontSearch.weight;

    if (!font.variants) { return true; }
    if (!weight) return true; 

    return font.variants.some((v) => v.indexOf(weight+'') > -1) 
}

const filterCategory = (font, filter) => { 

    if (!font.category) return false; 
    if (!filter.text) { return true; }

    return filter.categories.includes(font.category);
}

const filterFavorite = (font, filter) => {
    return font.favorite === true; 
}

/* searching function */ 

const search = (searchFilter, callback) => {

    let results = [];

    Object.keys(fonts).forEach((key) => {
        const fontList = fonts[key];

        results = results.concat(fontList.items.filter((font) => {
            font.type = fontList.type; 
            return searchFilter.funcs.every((filtering) => {
                const result = filtering(font, searchFilter.filter)

                return result; 
            })
        }))

    })

    callback && callback(results);
}

const createSearchFilter = (filter) => {
    let searchFilter = {filter: filter, funcs : []}

    if (filter.type) {
        searchFilter.funcs.push(filterType)
    }

    if (filter.text) {
        filter.text = new RegExp(filter.text, "ig");
        searchFilter.funcs.push(filterText)
    }

    if (filter.favorite) {
        searchFilter.funcs.push(filterFavorite)
    }    

    if (filter.googleFontSearch) {
        if (filter.googleFontSearch.weight) {
            searchFilter.funcs.push(filterWeight)
         }
     
         if (filter.googleFontSearch.category) {
             filter.categories = Object.keys(filter.googleFontSearch.category).filter(c => filter.googleFontSearch.category[c]);
     
             if (filter.categories.length) {
                 searchFilter.funcs.push(filterCategory)
             }
     
         }    
     
    }


    return searchFilter;
}

const searchFonts = (filter, callback) => {

    const searchFilter = createSearchFilter(filter); 

    search(searchFilter, callback)

}

export default {
    searchFonts 
}