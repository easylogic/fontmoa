const electron = window.require('electron')
const { net } = electron.remote; 

const fs = window.require('fs')
const url = window.require('url')

const fetch = (url, callback) => {

    const request = net.request(url)
    request.setHeader('User-Agent', 'Fontmoa v1.0.9')
    request.setHeader('Cache-Control', 'no-cache')    
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

const downloadFile = (link, target, callback) => {

    const urlObj = url.parse(link);

    const request = net.request(urlObj)
    request.setHeader('Connection', 'keep-alive, close')
    request.setHeader('User-Agent', 'Fontmoa v1.0.9')
    request.setHeader('Cache-Control', 'no-cache')
    request.setHeader('Accept-Encoding', '*')
    //console.log('download', link, target, 'start');
    request.on('response', (response, a) => {

        let stream = fs.createWriteStream(target, { flag : 'w+' });

        //console.log('response', JSON.stringify(response.headers), target);
        //response.pipe(stream);

        response.on('data', (chunk) => {
            stream.write(chunk);
            //console.log('data', chunk.length, target);
        })

        response.on('end', () => {
            //console.log('end', target);
            stream.end();
            
        })

        response.on('close', () => {
            //console.log('waiting, close', target);
            stream.close();
            setTimeout(callback, 10);
        })
    })
    request.on('error', (e) => {
        console.log(e, target);
    })
    request.end();
}


export default {
    fetch,
    downloadFile
}