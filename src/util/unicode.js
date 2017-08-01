const fs = window.require('fs');

const data = fs.readFileSync('src/resources/UnicodeBlocks.txt') + "";
let UNICODE_BLOCK = [ ]
data.split('\n').forEach((line) => {
    const arr = line.split(";");

    const index = UNICODE_BLOCK.length;
    UNICODE_BLOCK[index] = {
        index: index,
        start : parseInt(arr[0], 16),
        end : parseInt(arr[1], 16),
        name : arr[2]
    }
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