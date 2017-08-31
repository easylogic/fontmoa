const request = window.require('request');
const fs = window.require('fs')

// reference to https://ourcodeworld.com/articles/read/228/how-to-download-a-webfile-with-electron-save-it-and-show-download-progress
const _downloadFileUtil = (configuration, ) => {
    return new Promise((resolve, reject) => {
         // Save variable to know progress
         var received_bytes = 0;
         var total_bytes = 0;
 
         var req = request({
             method: 'GET',
             uri: configuration.remoteFile
         });
 
         var out = fs.createWriteStream(configuration.localFile);
         req.pipe(out);
 
         req.on('response', function ( data ) {
             // Change the total bytes value to get progress later.
             // FIXME: Content-Length is none 
             total_bytes = parseInt(data.headers['content-length' ], 10);
         });
 
         // Get progress if callback exists
         if(configuration.hasOwnProperty("onProgress")){
             req.on('data', function(chunk) {
                 // Update the received bytes
                 received_bytes += chunk.length;
 
                 configuration.onProgress(received_bytes, total_bytes);
             });
         }else{
             req.on('data', function(chunk) {
                 // Update the received bytes
                 received_bytes += chunk.length;
             });
         }
 
         req.on('end', function() {
             resolve();
         });
    })
}


const downloadFile = (link, target, callback) => {

    _downloadFileUtil({
        remoteFile : link,
        localFile: target,
        onProgress: (received, total) => {
            //var percentage = (received * 100) / total;
            //console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
        },
    }).then(function(){
        callback && callback();
    });
}


export default {
    downloadFile
}