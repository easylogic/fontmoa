const SystemFolder = {
   "darwin" : [
        { name : 'fontmanager.category.system.folder.name', directory : '/Library/Fonts'},
        { name : 'Google Font', type : 'googlefont', directory: 'data/googlefont/main-font'},
        { name : 'Google Early Access', directory: 'data/googlefont/early-access'},        
   ],
   "win32" : [
        { name : 'fontmanager.category.system.folder.name', directory : 'c:\\Windows\\Fonts'},
        { name : 'Google Font', type : 'googlefont', directory: 'data\\googlefont\\main-font'},
        { name : 'Google Early Access',  directory: 'data\\googlefont\\early-access'},
   ],
    "linux": [

   ]
}

export default SystemFolder