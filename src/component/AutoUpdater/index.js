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
        self.app.updateStatusForAutoUpdate();

      } else if (text === 'Checking for update...') { 

      } else if (text === 'Update not available.') { 

      } else if (text.includes('Error in auto-updater.')) { 

      } else if (text.includes('Update downloaded')) {
        self.app.hideLoading(0);
      } else if (text.includes('Download')) {
        self.app.showLoading("Update downloading...");
      }
    })

    ipcRenderer.send('checking-for-available');
  }

} 

export default AutoUpdater;
