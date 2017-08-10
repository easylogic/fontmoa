import emojiFilter from './emojiFilter'

const emojson = window.require('emojson');

const getEmojiTagList = () => {
    let tags = {};

    emojson.getData().forEach((emoji) => {
        emoji.tags.forEach(tag => {
            let store = tags[tag];
            if (!store) {
                store = tags[tag] = [];
            }

            store[store.length] = emoji; 
        })
    })

    return tags;
}

const filterEmoji = (emojiData) => {

    switch(window.process.platform) {
        case 'darwin':  return emojiFilter.darwin(emojiData);
        case 'linux':  return emojiFilter.linux(emojiData);
        default: return emojiFilter.win32(emojiData);
    }
}

const getEmojiList = () => {
    let emojiData = {};

    emojson.getData().forEach((emo) => {
        const category = emo.generalCAtegory || emo.generalCategory;
        let a =  emojiData[category];

        if (!a) {
            a = emojiData[category] = [];
        }

        a.push(emo);
    })

    return filterEmoji(emojiData);
}

export default {
    getEmojiList,
    getEmojiTagList
}