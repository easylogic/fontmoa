const { ipcRenderer } = window.require('electron'); 

class AutoUpdater {

  constructor (app) {
   
    this.app = app; 
    this._isUpdateReady = false;  

    this.init()
  }

  checkingForUpdate () {
    ipcRenderer.send('checking-for-update');
  } 

  isUpdateReady () {
    return this._isUpdateReady
  }

  init () {
    const self = this; 
    ipcRenderer.on('message', function (event, text) {
      if (text === 'Update available.') {
        self._isUpdateReady = true; 
        self.app.loadMenu();
      } 
    })

    ipcRenderer.send('checking-for-available');
  }

} 

export default AutoUpdater;
