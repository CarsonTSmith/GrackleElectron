const form = document.getElementById('send-message-form');

let username = '';



function add_outgoing_message(jsonbody)
{
    var div = document.createElement('div');
    div.setAttribute('class', 'outgoing-chats');
    div.innerHTML = `
        <div class="outgoing-msg">
            <div class="outgoing-chats-msg">
                <p class="multi-msg">
                    ${jsonbody['message']}
                </p>
                <span class="time">
                    ${jsonbody['username']} ${ '--' } ${jsonbody['timestamp']}
                </span>
            </div>
        </div>
    `;
    document.getElementById('msgs-container').appendChild(div);
}

function add_incoming_message(jsonbody)
{
    var div = document.createElement('div');
    div.setAttribute('class', 'received-chats');
    div.innerHTML = `
        <div class="received-msg">
            <div class="received-msg-inbox">
                <p class="multi-msg">
                    ${jsonbody['message']}
                </p>
                <span class="time">
                    ${jsonbody['username']} ${ '--' } ${jsonbody['timestamp']}
                </span>
            </div>
        </div>
    `;
    document.getElementById('msgs-container').appendChild(div);
}

function append_message(body_obj)
{
    console.log(body_obj);
    if (body_obj['path'] != '/chat/send') {
        return;
    }

    if (body_obj['username'] === username) {
        // outgoing message
        add_outgoing_message(body_obj);
    } else {
        // incoming message
        add_incoming_message(body_obj);
    }
}

window.electronAPI.get_username_from_main(function(event, usernamein) {
    if (usernamein.length > 0) {
        username = usernamein;
    }
});

window.electronAPI.chat_msg_to_renderer(function(event, body_obj) {
    append_message(body_obj);
    let scroll = document.getElementById('msgs-container');
    if (Math.abs(scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight) < 150) {
        scroll.scrollTop = scroll.scrollHeight;
    }
    
    console.log(body_obj);
});

form.addEventListener('submit', function(ev) {
    ev.preventDefault();
    console.log('button pressed');
    body_obj = {path: '/chat/send', message: document.getElementById('text-input').value, client: "Grackle Electron"};
    window.electronAPI.send_chat_msg(body_obj);
    document.getElementById('text-input').value = "";
    console.log('sent to server');
});