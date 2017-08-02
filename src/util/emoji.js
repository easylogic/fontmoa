const emojson = window.require('emojson');

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
    getEmojiList
}