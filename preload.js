const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('APPController', {
    api: (channel, data) => {
        // whitelist channels
        let validChannels = ['api'];
        console.log('api called');
        if (validChannels.includes(channel)) {
           return ipcRenderer.invoke(channel, data);
        }
    },
});