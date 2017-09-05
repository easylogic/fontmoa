const SystemFolder = {
   "darwin" : [
        { name : 'fontmanager.category.system.folder.name', type : 'system', directory : '/Library/Fonts'},
        { name : 'Local Font', type : 'local', directory: '~/Library/Fonts/fontmoa'},
   ],
   "win32" : [
        { name : 'fontmanager.category.system.folder.name', type : 'system', directory : 'c:\\Windows\\Fonts'},
        { name : 'Local Font', type : 'local',  directory: 'data\\fonts'},
   ],
    "linux": [
        { name : 'fontmanager.category.system.folder.name', type : 'system', directory : '/usr/share/fonts'},        
        { name : 'Local Font', type : 'local',  directory: '~/.fonts/fontmoa'},        
   ]
}

export default SystemFolder