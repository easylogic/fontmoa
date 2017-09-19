// ./main.js
const {app, BrowserWindow, protocol, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')
const log = require('electron-log');
const path  = require('path')
const url = require('url') 
const fs = require('fs');

// set logger 
autoUpdater.autoDownload = false;  
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

const isDevMode = !!process.env.ELECTRON_START_URL;

let win = null;

// define protocol for inner file system 
const PROTOCOL_PREFIX = 'fontmoa'

function devToolsLog(s) {
  console.log(s)
  if (win && win.webContents) {
    win.webContents.executeJavaScript(`console.log("${s}")`)
  }
}

function createWindow() {
  // register protocol for fontmoa:// protocol
  protocol.registerFileProtocol(PROTOCOL_PREFIX, (req, callback) => {
    const url = req.url.substring(10);
    //devToolsLog('full url to open ' + url)

    let p = path.normalize(`${__dirname}/${url}`);

    if (!fs.existsSync(p) ) {
      p = path.normalize(decodeURIComponent(decodeURIComponent(unescape(url)))); 
      //devToolsLog(decodeURIComponent(p));
    }

    callback({path: p})
  }, (error) => {
    if (error) log.error('failed to register protocol');
  })


  // Initialize the window to our specified dimensions
  win = new BrowserWindow({
    width: 400, 
    height: 500
  });
  win.setMenu(null);

  // Specify entry point
  const startUrl = isDevMode ? process.env.ELECTRON_START_URL : url.format({
    pathname: path.join(__dirname, 'build/index.html'),
    protocol: 'file:',
    slashes : true
  })
  win.loadURL(startUrl);

  // Show dev tools
  // Remove this line before distributing
  if (isDevMode) {   // dev mode
    win.webContents.openDevTools()
  }

  // Remove window once app is closed
  win.on('closed', function () {
    win = null;
  });
}

ipcMain.on('progress-percent', function (e, percent) {
  devToolsLog(percent);
  //win.setProgressBar(percent);
})


app.on('ready', function () {

  createWindow();

});



app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

/**
 * AutoUpdater Settings 
 * 
 */

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);

  sendToWindow('message', text);
}

function sendToWindow() {
  win.webContents.send.apply(win.webContents, [...arguments]);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater.' +  err.message);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);

  win.setProgressBar(progressObj.percent/100);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded; will install in 5 seconds');
});

autoUpdater.on('update-downloaded', (info) => {
  setTimeout(function() {
    autoUpdater.quitAndInstall();  
  }, 2000)
})

ipcMain.on('checking-for-available', function(e)  {
  autoUpdater.autoDownload = false; 
  autoUpdater.checkForUpdates();
});

ipcMain.on('checking-for-update', function(e)  {
  autoUpdater.autoDownload = true; 
  autoUpdater.checkForUpdates();
});