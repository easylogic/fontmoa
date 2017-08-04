const fs = window.require('fs');

let UNICODE_BLOCK = [ ]

const createUnicodeBlockListCache = () => {
    if (UNICODE_BLOCK.length) return;

    let unicodeList = [];
    const data = fs.readFileSync('resources/UnicodeBlocks.txt') + "";
    data.split('\n').forEach((line) => {
        const arr = line.split(";");

        const index = unicodeList.length;
        unicodeList[index] = {
            index: index,
            start : parseInt(arr[0], 16),
            end : parseInt(arr[1], 16),
            name : arr[2],
            alias : {}
        }

        for(let i = 3, len = arr.length; i < len; i++) {
            const temp = arr[i].split(",");

            unicodeList[index].alias[temp[0]] = temp[1].trim();
        }
    })

    UNICODE_BLOCK = unicodeList.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
    }).map((code, index) => {
        code.index = index; 
        return code; 
    })
}

const getUnicodeBlockList = () =>{

    createUnicodeBlockListCache();

    return UNICODE_BLOCK;
}


const getBlockForIndex = (index) => {
    return getUnicodeBlockList()[index];
}

const getBlock = (unicode) => {
    return getUnicodeBlockList().filter((block) => {
        return block.start <= unicode && unicode <= block.end;
    })[0]
}

const checkBlockList = (unicodeList) => {
    let blocks = {};
    let list = [];

    if (!unicodeList || !unicodeList.length) {
        return getUnicodeBlockList();
    }

    unicodeList.forEach((unicode) => {
        const tempBlock = getBlock(unicode);

        if (tempBlock && !blocks[tempBlock.name]) {
            blocks[tempBlock.name] = true;
            list.push(tempBlock)
        } 
    })

    return list.sort((a, b) => {
        return a.start < b.start ? -1 : 1;   
    }); 
}

export default {
    getBlockForIndex,
    getBlock,
    checkBlockList 
}