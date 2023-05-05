const form = document.getElementById('send-message-form');

let username = '';
/*
window.electronAPI.get_username(event, usernamein, function() {
    console.log(usernamein);
    username = usernamein;
});
*/
// have main send the username and store it, then add it to the message

form.addEventListener('submit', function(ev) {
    ev.preventDefault();
    console.log('button pressed');
    // send the message to the server
    // format the msg
    body_str = JSON.stringify({ path: '/chat/send', message: document.getElementById('text-input').value, username: 'cars' })
    msg_len = String(body_str.length).padStart(8, '0');
    msg_to_send = msg_len + body_str;
    window.electronAPI.send_chat_msg(msg_to_send);
    document.getElementById('text-input').value = "";
    console.log('sent to server');
});