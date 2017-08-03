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

    return emojiData;
}

export default {
    getEmojiList,
    getEmojiTagList
}