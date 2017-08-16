const electron = window.require('electron')
const { net } = electron.remote; 

const fs = window.require('fs')
const url = window.require('url')

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

const downloadFile = (link, target, callback) => {
    let urlObj = url.parse(link);
    urlObj.cache = 'no-cache'

    const request = net.request(urlObj)
    request.setHeader('User-Agent', 'Fontmoa v1.0.9')
    request.on('response', (response) => {
        let stream = fs.createWriteStream(target, { flag : 'w+' });
        response.on('data', (chunk) => {
            stream.write(chunk);
        })
        response.on('end', () => {
            stream.end();
            callback && callback();
        })
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