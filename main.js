// ./main.js
const {app, BrowserWindow} = require('electron')
const path  = require('path')
const url = require('url') 

let win = null;

function createWindow() {
  // Initialize the window to our specified dimensions
  win = new BrowserWindow({width: 1000, height: 600});

  // Specify entry point
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes : true
  })
  win.loadURL(startUrl);

  // Show dev tools
  // Remove this line before distributing
  //win.webContents.openDevTools()

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