const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const web3 = require('web3');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/web3.min.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/web3/dist/web3.min.js');
})

app.get('/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js')
})

app.use(express.static(__dirname + '/public'));

let activeSocketConnections = 0;

io.on('connection', (socket) => {
    activeSocketConnections++;
    console.log('Socket connection made. Id : ' + socket.id + ", Active Socket Connections : " + activeSocketConnections);

    socket.on('disconnect', () => {
        activeSocketConnections--;
        console.log('Socket connection Closed. Active Socket Connections : ' + activeSocketConnections);
    });
});

server.listen(process.env.PORT, () => {
    console.log('Listening to port ' + process.env.PORT);
});
