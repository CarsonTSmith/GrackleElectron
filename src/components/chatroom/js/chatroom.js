const form = document.getElementById('send-message-form');

form.addEventListener('submit', function(ev) {
    ev.preventDefault();
    console.log('button pressed');
    // send the message to the server
    // format the msg
    body_obj = {path: '/chat/send', message: document.getElementById('text-input').value, client: "Grackle Electron"};
    window.electronAPI.send_chat_msg(body_obj);
    document.getElementById('text-input').value = "";
    console.log('sent to server');
});