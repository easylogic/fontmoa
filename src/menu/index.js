import Win32Menu from './win32'
import DarwinMenu from './darwin'
import LinuxMenu from './linux'

const { remote } = window.require('electron');
const { Menu } = remote; 

export default {
    getMenuTemplate (app) {
        switch(window.process.platform) {
            case 'darwin' : return new DarwinMenu(app); 
            case 'linux' : return new LinuxMenu(app); 
            default:  return new Win32Menu(app); 
        }
    },

    make (app) {
        const menu = Menu.buildFromTemplate(this.getMenuTemplate(app));
        Menu.setApplicationMenu(menu);
    }
}