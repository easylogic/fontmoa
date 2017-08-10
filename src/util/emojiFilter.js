const filterWin32 = (emojiData) => {
    return emojiData;
}

const filterDarwin = (emojiData) => {
    return filterWin32(emojiData);
}

const filterLinux = (emojiData) => {
    return filterWin32(emojiData);
}

export default {
    win32 : filterWin32,
    darwin: filterDarwin,
    linux: filterLinux
}