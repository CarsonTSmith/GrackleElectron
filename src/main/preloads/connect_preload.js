const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    connect_to_server:             (info) => ipcRenderer.send('app: connect_to_server', info),
    cant_connect_to_server:    (callback) => ipcRenderer.on('cant_connect_to_server', callback),
    send_chat_msg:                  (msg) => ipcRenderer.send('send_chat_msg', msg),
    chat_msg_to_renderer:      (callback) => ipcRenderer.on('chat_msg_to_renderer', callback),
    get_username_from_main:    (callback) => ipcRenderer.on('get_username_from_main', callback),
    update_available:          (callback) => ipcRenderer.on('update_available', callback),
    update_downloaded:         (callback) => ipcRenderer.on('update_downloaded', callback),
    restart_app:               (callback) => ipcRenderer.send('restart_app')
});
