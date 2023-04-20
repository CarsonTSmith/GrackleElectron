//const username = get the username from main

document.getElementById('text-input').onkeyup(function(ev) {
    if ((ev.code == 13) && (!ev.shiftKey)) {
        console.log('enter pressed');
        // send the message to the server
        // format the msg
        body_str = JSON.stringify({ path: '/chat/send', msg: document.getElementById('text-input').value, username: 'test' })
        msg_to_send = prepend_msg_header(body_str);
        // then send it
        window.electronAPI.send_chat_msg(msg_to_send);
        console.log('sent to server');
    }
});

function prepend_msg_header(msg_body)
{
    return String(msg_body).padStart(8, msg_body.length());
}