let username = '';

let send_button = document.getElementById('send-button');
let text_input  = document.getElementById('text-input');


text_input.addEventListener('keyup', function(event) {
    if ((event.key == 'Enter') && (!event.shiftKey)) {
        console.log('enter pressed');
        body_obj = {path: '/chat/send', message: document.getElementById('text-input').value, client: "Grackle Electron"};
        window.electronAPI.send_chat_msg(body_obj);
        document.getElementById('text-input').value = "";
        reset_cursor(document.getElementById('text-input'));
        console.log('sent to server');
    }
});

send_button.addEventListener('click', function(ev) {
    // ev.preventDefault();
    console.log('button pressed');
    body_obj = {path: '/chat/send', message: document.getElementById('text-input').value, client: "Grackle Electron"};
    window.electronAPI.send_chat_msg(body_obj);
    document.getElementById('text-input').value = "";
    reset_cursor(document.getElementById('text-input'));
    console.log('sent to server');
});

function reset_cursor(txtElement) { 
    if (txtElement.setSelectionRange) { 
        txtElement.focus(); 
        txtElement.setSelectionRange(0, 0); 
    } else if (txtElement.createTextRange) { 
        var range = txtElement.createTextRange();  
        range.moveStart('character', 0); 
        range.select(); 
    } 
}

function add_outgoing_message(jsonbody)
{
    var div = document.createElement('div');
    div.setAttribute('class', 'd-flex flex-row justify-content-end');
    div.innerHTML = `
        <div class="overflow-auto text-wrap">
            <pre class="small p-2 me-3 mb-1 text-white rounded-3 text-wrap wrap-break outgoing-msg">${jsonbody['message']}</pre>
            <p class="small me-3 mb-3 rounded-3 user-time-stamp">${jsonbody['username']} ${ '--' } ${jsonbody['timestamp']}</p>
        </div>
        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
        alt="avatar 1" style="width: 45px; height: 100%;">
    `;
    document.getElementById('msgs-container').appendChild(div);
}

function add_incoming_message(jsonbody)
{
    var div = document.createElement('div');
    div.setAttribute('class', 'd-flex flex-row justify-content-start');
    div.innerHTML = `
        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
        alt="avatar 1" style="width: 45px; height: 100%;">
        <div class="overflow-auto">
            <pre class="small p-2 ms-3 mb-1 rounded-3 text-wrap wrap-break incoming-msg">${jsonbody['message']}</pre>
            <p class="small ms-3 mb-3 rounded-3 user-time-stamp">${jsonbody['username']} ${ '--' } ${jsonbody['timestamp']}</p>
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
        add_outgoing_message(body_obj);
    } else {
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
    if (Math.abs(scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight) < 250) {
        scroll.scrollTop = scroll.scrollHeight;
    }
    
    console.log(body_obj);
});
