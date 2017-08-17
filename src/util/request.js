const electron = window.require('electron')
const { net } = electron.remote; 

const fs = window.require('fs')

const fetch = (url, callback) => {

    const request = net.request(url)
    request.setHeader('User-Agent', 'Fontmoa v1.0.9')
    request.on('response', (response) => {
        let responseData = "";
        response.on('data',  (chunk) => {
            responseData += chunk;
        })
        response.on('end', () => {
            callback && callback(responseData);
        })
    })
    request.on('error', (err) => {
        console.log(err)
    })
    request.end();
}

const downloadFile = (link, target, callback, opt) => {
    //let urlObj = url.parse(link);
    //urlObj.cache = 'no-cache'
    opt = opt || { delay : 200 }

    const request = net.request(link)
    request.setHeader('User-Agent', 'Fontmoa v1.0.9')
    //console.log(urlObj);
    request.on('response', (response, a) => {

        let stream = fs.createWriteStream(target, { flag : 'w+' });

        let status = { isDone : false, count : 0 };

        response.on('data', (chunk) => {
            stream.write(chunk);
            status.isDone = true; 

        })
        response.on('end', () => {
            stream.end();
            callback && callback();
        })

        const timer = setInterval(() => {
            if (status.count > 3) {
                clearInterval(timer);
                response.emit('end');
                return;
            }

            if (status.isDone) {
                status.count++;
            }
        }, opt.delay || 200);
    })
    request.on('error', (err) => {
        console.log(err)
    })
    request.end();
}


export default {
    fetch,
    downloadFile
}