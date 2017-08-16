const electron = window.require('electron')
const { net } = electron.remote; 

const fetch = (url, callback) => {

    const request = net.request(url)
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


export default {
    fetch,
}