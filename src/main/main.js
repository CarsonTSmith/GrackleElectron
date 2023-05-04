const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const net  = require('net');
var player = require('play-sound')(opts = {})




class tcpclient {
  constructor() {
    this.socket = new net.Socket();
    this.username = "";
    this.buf = "";
    this.header_is_done = false;
    this.body_size = 0;
    this.body_bytes_read = 0
    this.header_bytes_read = 0;

    this.set_socket_listeners();
  }

  set_socket_listeners() {
    this.socket.on('error', function(e) {
      win.webContents.send('cant_connect_to_server');
      console.log('cant connect to server');
      win.loadFile('src/components/connect/index.html');
    });
    
    this.socket.on('connect', function(e) {
      console.log('connected to server');
      //win.setSize(1920, 1080);
      win.loadFile('src/components/chatroom/html/index.html');
    });
    
    this.socket.on('data', async function(data) { // process incoming messages
      console.log('data received');
      if (this.buf == null) {
        this.buf = data.toString();
      } else {
        this.buf += data.toString();
      }
      
      if (this.buf.length >= 17) {
        let body_len = this.buf.substr(0, 8);
        console.log(body_len);
        console.log("hit here");
        this.body_size = parseInt(body_len);
        console.log(this.body_size);
      }

      console.log(this.buf);
      if ((this.body_size + 8) >= this.buf.length ) {
        // parse json
        console.log("in the if");
        let bodystr;
        for (let i = 8; i < this.buf.length; ++i) {
          if (this.buf[i] == '{') {
            bodystr = this.buf.substr(i, this.buf.length);
            break;
          }
        }

        let jsonbody = JSON.parse(bodystr);
        console.log(jsonbody["path"]);

        switch (jsonbody["path"]) {
          case "/chat/send":
            console.log("/chat/send received");
            console.log(jsonbody["message"]);
            if (jsonbody["username"] != client.username) {
              player.play('/home/carson/Projects/Grackle/GrackleElectron/sounds/notification_sound.mp3', function (err) {
                if (err) {
                  console.log("Audio finished");
                }
              });
            }
        
            break;
          default:
            console.log("default");
            break;
        }

        this.buf = ""; 
      }
    }); // END process incoming messages
    
    this.socket.on('end', function() {
      win.loadFile('src/components/connect/index.html');
    });
  }
}


let win;
let client = new tcpclient();


//const primary_screen     = screen.getPrimaryDisplay();
//const dimensions         = primary_screen.size;

const create_connect_win = () => {
  const connect_win_width  = 0.5 * 1920;
  const conenct_win_height = 0.7 * 1080;
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname + '/preloads/', 'connect_preload.js')
    },
    width: connect_win_width,
    height: conenct_win_height,
    //autoHideMenuBar: true,
  });

  ipcMain.on('app: connect_to_server', function(event, socket_info) {
    console.log(socket_info);
    client.socket.connect(socket_info.port, socket_info.ip);
    client.username = socket_info.username;
  });

  ipcMain.on('send_chat_msg', function(event, msg) {
    console.log('writing msg = ' + msg);
    client.socket.write(msg);
  });

  win.loadFile('src/components/connect/index.html');
}

app.whenReady().then(() => {
  create_connect_win();

  app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0)
        create_connect_win()
  });

});


