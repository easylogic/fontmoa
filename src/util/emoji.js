const fs = window.require('fs');

const emojiJson = JSON.parse(fs.readFileSync('resources/EmojiList.json') + "");

const getEmojiList = () => {
    let emojiData = {};

     Object.keys(emojiJson).forEach((emojiKey) => {
        let store = emojiData[emojiKey] = [];

        const list = emojiJson[emojiKey].split('');

        const total = list.length;
        for(let i = 0; i < total; i++) {
            store[i] = list[i].codePointAt(0);
        }
     });

    return emojiData;
}

export default {
    getEmojiList
}