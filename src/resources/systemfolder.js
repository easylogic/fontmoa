const SystemFolder = {
   "darwin" : [
        { name : 'fontmanager.category.system.folder.name', type : 'system', directory : '/Library/Fonts'},
        { name : 'Local Font', type : 'local', directory: 'data/fonts'},
   ],
   "win32" : [
        { name : 'fontmanager.category.system.folder.name', type : 'system', directory : 'c:\\Windows\\Fonts'},
        { name : 'Local Font', type : 'local',  directory: 'data\\fonts'},
   ],
    "linux": [

   ]
}

export default SystemFolder