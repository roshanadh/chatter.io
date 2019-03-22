/* Joining the default namespace */
var socket = io();
let username = '';
/*
    ~ Event handlers ~
*/
socket.on('userSet', (data) => {
    var logBox = document.getElementById('log-container');
    var input = document.getElementById('username');
    var button = document.getElementById('btnSend');
    input.id = 'message';
    input.value = '';
    input.placeholder = 'Type your message';
    input.style.padding = '12px 20px';
    input.style.width = '85%';
    button.innerText = 'Send Message';
    button.onclick = sendMessage;
    logBox.innerHTML += "<div style='color:green;'>SUCCESS - <i>" + username + "</i> has been logged in!";

});

socket.on('newUser', (data) => {
    var msgBox = document.getElementById('newMsg');
    msgBox.innerHTML += "<div style='text-align: center; color: blue;'><b>" + data.username + "</b> has entered the chat!</div>"; 
});

socket.on('usernameExists', (data) => {
    var logBox = document.getElementById('log-container');
    logBox.innerHTML += "<div style='color:red;'>ERROR - <i>" + username + "</i> already taken!";
});

socket.on('newMsg', (data) => {
    var oldMsgBox = document.getElementById('message');
    var msgBox = document.getElementById('newMsg');
    var msgFromSelf = false, msgFromOther = false;

    oldMsgBox.value = '';
    
    if(data.user === username)
        msgFromSelf = true;
    else 
        msgFromOther = true;
    
    if(msgFromSelf === true){
        msgBox.innerHTML += "<br><div class='message' style='position: absolute; right:20px; background-color:rgba(200, 247, 197, 0.8);'>" + data.message + "</div><br>";
    }
    else
    msgBox.innerHTML += "<span class='msgSender'>" + data.user + "</span><br><div class='message'>" + data.message + "</div>";
        
    
});

socket.on('userLeft', (username) => {
    var msgBox = document.getElementById('newMsg');
    msgBox.innerHTML += "<div style='text-align: center; color: red;'><b>" + username + "</b> has left the chat!</div>";
});

function setUsername(){
    var logBox = document.getElementById('log-container');
    username = document.getElementById('username').value;

    if(username.trim() != '')
        socket.emit('setUsername', username);
    else
        logBox.innerHTML = "<div style='text-align: center; color: red;'><b>Username cannot be empty!</div>";
    
    // Clear logbox after 5 seconds
    setTimeout( () => {
        logBox.innerHTML = '';
    }, 5000);
}

function sendMessage(){
    var logBox = document.getElementById('log-container');
    var message = document.getElementById('message').value;
    var user = username;

    if(message.trim() != '')
        socket.emit('msg', {user: user, message: message});
    else
        logBox.innerHTML = "<div style='text-align: center; color: red;'><b>Message cannot be empty!</div>";

    // Clear logbox after 5 seconds
    setTimeout( () => {
        logBox.innerHTML = '';
    }, 5000);
}