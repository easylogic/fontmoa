const SystemFolder = {
   "darwin" : [
        { name : 'fontmanager.category.system.folder.name', type : 'system', directory : '/Library/Fonts'},
        { name : 'User Font', type : 'userfont', directory: 'data/fonts'},
   ],
   "win32" : [
        { name : 'fontmanager.category.system.folder.name', type : 'system', directory : 'c:\\Windows\\Fonts'},
        { name : 'User Font', type : 'userfont',  directory: 'data\\fonts'},
   ],
    "linux": [

   ]
}

export default SystemFolder