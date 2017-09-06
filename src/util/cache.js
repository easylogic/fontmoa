import common from './common'

const DataStore  = window.require('nedb');

// key, value based data base 
const cacheDB = new DataStore({ filename : common.getUserData('data/cache.data') });
cacheDB.loadDatabase((err) => {})

const get = (key, callback) => {
    cacheDB.findOne({ key }, (err, doc) => {
        callback && callback (doc && doc.value);
    })
}

const isInitialize = (key, callback) => {
    cacheDB.count({key}, (err, count) => {
        callback && callback(!!count);
    })
}

const set  = (key, value, callback) => {

    isInitialize(key, (isInit) => {
        if (isInit) {
            cacheDB.update({ key }, { key, value }, {}, (err, count) => {
                callback && callback (err);
            })
        } else {
            cacheDB.insert({ key, value }, (err) => {
                callback && callback (err, 1);
            })
        }

    })

}

const addToSet = (key, value, callback) => {

    isInitialize(key, (isInit) => {
        value = (Array.isArray(value)) ? value : [value];

        if (isInit) {
            
            cacheDB.update({ key }, {
                $addToSet: { 
                    value: { $each: value } 
                }
            }, {upsert: true, multi: false}, (err, count) => {
                callback && callback (err, count);
            })
        } else {
            cacheDB.insert({ key , value }, (err) => {
                callback && callback (err, 1);
            })
        }
    })
}


const push = (key, value, callback) => {
    
    isInitialize(key, (isInit) => {
        value = (Array.isArray(value)) ? value : [value];

        if (isInit) {
            
            cacheDB.update({ key }, {
                $push: { 
                    value: { $each: value } 
                }
            }, {}, (err, count) => {
                callback && callback (err, count);
            })
        } else {
            cacheDB.insert({ key , value }, (err) => {
                callback && callback (err, 1);
            })
        }
    })
}


const pull = (key, value, callback) => {
    
    isInitialize(key, (isInit) => {
        value = (Array.isArray(value)) ? value : [value];

        if (isInit) {
            
            cacheDB.update({ key }, {
                $pull: { 
                    value: { $in: value } 
                }
            }, {}, (err, count) => {
                callback && callback (err, count);
            })
        } else {
            // 아무것도 없으면 그냥 리턴 
            callback && callback (null, 0);
        }
    })
}

const inc = (key, callback) => {
    cacheDB.update({ key }, { $inc : { value : 1 } }, {}, (err) => {
        callback && callback (err);
    })
}

const cache = {
    get,
    set,
    inc,
    push,
    pull,
    addToSet,
}

export default cache