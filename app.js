const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let users = [];
io.on('connection', (socket) => {
    console.log('a user has connected');

    socket.on('setUsername', (username) =>{
        console.log('USER/login-query - ' + username);
        console.log(users.indexOf(username));
        if(users.indexOf(username) <= -1){
            users.push(username);
            socket.emit('userSet', {username: username});
            console.log('USER - ' + username + ' logged in!');
        }
        else{
            socket.emit('usernameExists', username);
            console.log('USER - ' + username + ' already exists!');
        }
    });

    socket.on('msg', (data) => {
        //Send the incoming message to all connected clients
        io.sockets.emit('newMsg', data);
        console.log('MESSAGE - FROM :' + data.user + ', MSG : ' + data.message);
    });

    socket.on('disconnect', () => {
        console.log('a user has disconnected');
    });
});

http.listen(PORT, () => {
    console.log(`Server is now listening on port ${PORT}`);
});