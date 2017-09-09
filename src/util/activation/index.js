import Win32FontActivation from './win32'
import DarwinFontActivation from './darwin'
import LinuxFontActivation from './linux'


function create () {
    switch(window.process.platform) {
        case 'darwin' : return new DarwinFontActivation(); 
        case 'linux' : return new LinuxFontActivation(); 
        default:  return new Win32FontActivation(); 
    }
}


export default {
   create,
}