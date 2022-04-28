const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
    'electronapi',
    {
        onFilePath: function(func){
            ipcRenderer.on('filePath', (event, filePath) => func(filePath));   
        }  
    }
)
