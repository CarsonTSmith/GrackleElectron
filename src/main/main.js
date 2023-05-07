const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const net  = require('net');
const { time } = require('console');
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
      window.win.webContents.send('cant_connect_to_server');
      console.log('cant connect to server');
      if (window.current_window === 'src/components/connect/index.html') {
        return;
      }

      window.win.loadFile('src/components/connect/index.html');
      window.current_window = 'src/components/connect/index.html';
    });



    
    this.socket.on('connect', function(e) {
      console.log('connected to server');
      //win.setSize(1920, 1080);
      window.win.loadFile('src/components/chatroom/html/index.html');
      window.current_window = 'src/components/chatroom/html/index.html';
      window.win.webContents.send('get_username', client.username);
    });



    
    this.socket.on('data', async function(data) { // process incoming messages
      console.log('data received');
      if (this.buf == null) {
        this.buf = data.toString();
      } else {
        this.buf += data.toString();
      }
      
      let body_len;
      if (this.buf.length >= 8) {
        body_len = this.buf.substr(0, 8);
        this.body_size = parseInt(body_len);
      }

      if ((this.body_size + 8) >= this.buf.length ) {
        let bodystr;
        for (let i = 8; i < this.buf.length; ++i) {
          if (this.buf[i] == '{') {
            bodystr = this.buf.substr(i, this.buf.length);
            break;
          }
        }

        let jsonbody = JSON.parse(bodystr);
        switch (jsonbody["path"]) {
          case "/chat/send":
            window.win.webContents.send('get_username_from_main', client.username);
            window.win.webContents.send('chat_msg_to_renderer', jsonbody);
            if ((jsonbody["username"] != client.username)) {
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
        
        // remove the message that was just processed from the front of the buf
        this.buf = this.buf.replace(body_len + bodystr, ""); 
      }
    }); // END process incoming messages



    
    this.socket.on('end', function() {
      window.win.loadFile('src/components/connect/index.html');
      window.current_window = 'src/components/connect/index.html';
    });



  }
}





class main_window {
  constructor() {
    this.win;
    this.current_window;
  }
  
}





let window = new main_window();
let client = new tcpclient();


//const primary_screen     = screen.getPrimaryDisplay();
//const dimensions         = primary_screen.size;

const create_connect_win = () => {
  const connect_win_width  = 0.5 * 1920;
  const conenct_win_height = 0.7 * 1080;
  window.win = new BrowserWindow({
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
    body_str = JSON.stringify({path: msg.path, message: msg.message, username: client.username, client: msg.client});
    msg_len = String(body_str.length).padStart(8, '0');
    msg_to_send = msg_len + body_str;
    client.socket.write(msg_to_send);
    console.log('wrote msg = ' + msg_to_send);
  });

  window.win.loadFile('src/components/connect/index.html');
  window.current_window = 'src/components/connect/index.html';
}


// entry point
app.whenReady().then(() => {
  create_connect_win();

  app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0)
        create_connect_win()
  });

});



