const DataStore  = window.require('nedb');

// key, value based data base 
const cacheDB = new DataStore({ filename : 'data/cache.data' });
cacheDB.loadDatabase((err) => {})

const get = (key, callback) => {
    cacheDB.findOne({ key }, (err, doc) => {
        callback && callback (doc.value);
    })
}

const set  = (key, value, callback) => {
    cacheDB.update({ key }, { key, value }, {}, (err) => {
        callback && callback (err);
    })
}

const addToSet = (key, value, callback) => {
    cacheDB.update({ key }, { $addToSet : { value }  }, {}, (err) => {
        callback && callback (err);
    })
}
const add = (key, callback) => {
    cacheDB.update({ key }, { $inc : { value : 1 } }, {}, (err) => {
        callback && callback (err);
    })
}

const cache = {
    get,
    set,
    inc,
    addToSet,
}

export default cache