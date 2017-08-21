const SystemFolder = {
   "darwin" : [
        { name : 'fontmanager.category.system.folder.name', type : 'system', directory : '/Library/Fonts'},
        { name : 'Google Font', type : 'googlefont', directory: 'data/googlefont/main-font'},
   ],
   "win32" : [
        { name : 'fontmanager.category.system.folder.name', type : 'system', directory : 'c:\\Windows\\Fonts'},
        { name : 'Google Font', type : 'googlefont',  directory: 'data\\googlefont\\main-font'},
   ],
    "linux": [

   ]
}

export default SystemFolder