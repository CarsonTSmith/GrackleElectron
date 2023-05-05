const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    connect_to_server:            (info) => ipcRenderer.send('app: connect_to_server', info),
    cant_connect_to_server:   (callback) => ipcRenderer.on('cant_connect_to_server', callback),
    send_chat_msg:                 (msg) => ipcRenderer.send('send_chat_msg', msg),
    get_username:           (usernamein, callback) => ipcRenderer.on('get_username', usernamein, callback)
});
