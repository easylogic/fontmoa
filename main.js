// ./main.js
const {app, BrowserWindow, protocol } = require('electron')
const path  = require('path')
const url = require('url') 
const fs = require('fs');

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
  // register protocol
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
    if (error) console.error('failed to register protocol');
  })


  // Initialize the window to our specified dimensions
  win = new BrowserWindow({
    width: 400, 
    height: 500,
    //alwaysOnTop : true
  });
  win.setMenu(null);

  // Specify entry point
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, 'build/index.html'),
    protocol: 'file:',
    slashes : true
  })
  win.loadURL(startUrl);

  // Show dev tools
  // Remove this line before distributing
  win.webContents.openDevTools()
  //devToolsLog('process args ' + process.argv.join(','))


  // Remove window once app is closed
  win.on('closed', function () {
    win = null;
  });
}

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