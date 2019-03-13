const app = require('express')();
const http = require('http').Server(app);

// Instantiate socket.io instance by passing http instance to the constructor
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

// Define default route handler
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// List of users logged in to the chat server
let users = [];

// Event handler - invoked when a client connects
io.on('connection', (socket) => {
    console.log('a user has connected');

    // Event handler - invoked when a client tries to login
    socket.on('setUsername', (username) =>{
        console.log('USER/login-query - ' + username);
        console.log(users.indexOf(username));

        // Add the username to the list if it isn't there already
        if(users.indexOf(username) <= -1){
            users.push(username);

            // Fire custom event notifying the successful login
            socket.emit('userSet', {username: username});
            socket.broadcast.emit('newUser', {username: username});
            console.log('USER - ' + username + ' logged in!');
        }
        else{

            // Fire custom event notifying the error in login
            socket.emit('usernameExists', username);
            console.log('USER - ' + username + ' already taken!');
        }
    });


    // Event handler - invoked when a user tries to send message
    socket.on('msg', (data) => {
        //Send the incoming message to all connected clients
        io.sockets.emit('newMsg', data);
        console.log('MESSAGE - FROM :' + data.user + ', MSG : ' + data.message);
    });

    // Event handler - invoked when a user leaves the connection
    socket.on('disconnect', () => {
        console.log('a user has disconnected');
    });
});

// Binding the http instance to a port number
http.listen(PORT, () => {
    console.log(`Server is now listening on port ${PORT}`);
});