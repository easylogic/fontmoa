const fs = window.require('fs');

const data = fs.readFileSync('resources/UnicodeBlocks.txt') + "";
let UNICODE_BLOCK = [ ]
data.split('\n').forEach((line) => {
    const arr = line.split(";");

    const index = UNICODE_BLOCK.length;
    UNICODE_BLOCK[index] = {
        index: index,
        start : parseInt(arr[0], 16),
        end : parseInt(arr[1], 16),
        name : arr[2],
        alias : {}
    }

    for(let i = 3, len = arr.length; i < len; i++) {
        const temp = arr[i].split(",");

        UNICODE_BLOCK[index].alias[temp[0]] = temp[1].trim();
    }
})

UNICODE_BLOCK = UNICODE_BLOCK.sort((a, b) => {
    return a.name > b.name ? 1 : -1;
}).map((code, index) => {
    code.index = index; 
    return code; 
})



const getBlockForIndex = (index) => {
    return UNICODE_BLOCK[index]
}

const getBlock = (unicode) => {
    return UNICODE_BLOCK.filter((block) => {
        return block.start <= unicode && unicode <= block.end;
    })[0]
}

const checkBlockList = (unicodeList) => {
    let blocks = {};
    let list = [];

    if (!unicodeList || !unicodeList.length) {
        return UNICODE_BLOCK;
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