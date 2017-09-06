const parallel  = (arr, func, done) => {
    

    let results = [];
    let startIndex = -1; 
    const total = arr.length; 

    const lastFunction = () => {

        let temp = [];
        results.forEach(it => {
            temp[it.index] = it.ret;
        })

        done && done(temp);
    }

    const startFunction = () => {
        const item = arr[startIndex];
        if (results.length === total) {
            lastFunction();
            return; 
        }

        func(item, () => {
            results.push({ index : startIndex, ret : [...arguments] }); 
            nextFunction();
        }, lastFunction);
    }

    const nextFunction = () => {
        startIndex++;

        startFunction();
    }

    nextFunction();
}

const seq  = (arr, func, done) => {

    let startIndex = -1; 
    const total = arr.length; 
    const results = [];

    const lastFunction = () => {
        done && done(results);
    }

    const startFunction = () => {
        const item = arr[startIndex];
        if (startIndex >= total) {
            lastFunction();
            return; 
        }

        func(item, () => {
            results.push([...arguments])
            nextFunction()
        }, lastFunction);
    }

    const nextFunction = () => {
        startIndex++;

        startFunction();
    }

    nextFunction();
}

export default {
    seq,
    parallel,
}