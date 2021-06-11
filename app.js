const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const uIdV4 = require("uuid/v4");
const Web3 = require('web3');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const web3 = new Web3();

app.get('/web3.min.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/web3/dist/web3.min.js');
})

app.get('/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js')
})

app.get('confirm-Signature/:uID', (req, res) => {
    res.sendFile(__dirname + '/public/signatureRequestPage.html');
});

app.use(express.static(__dirname + '/public'));

let activeSocketConnections = 0;

let pendingRequests = [];

io.on('connection', (socket) => {
    activeSocketConnections++;
    console.log('Socket connection made. Id : ' + socket.id + ", Active Socket Connections : " + activeSocketConnections);

    socket.on('disconnect', () => {
        activeSocketConnections--;
        console.log('Socket connection Closed. Active Socket Connections : ' + activeSocketConnections);
    });

    socket.on('Get Signature Request URL', (address) => {
        const uniqueID = uIdV4();
        const verifyData = {
            url: 'https://blockchain-reader-website.herokuapp.com/' + 'confirm-Signature/' + uniqueID,
            address: address,
            code: uIdV4(),
            socketId: socket.id
        };

        pendingRequests[uniqueID] = verifyData;

        socket.broadcast.emit('setOutput', {
            outputText: verifyData.url
        });
    });

    socket.on('getCodeForSignature', (uId) => {
        socket.broadcast.emit('callDataSigner', {
            code: pendingRequests[uId].code,
            address: pendingRequests[uId].address
        });
    });

    socket.on('verifySignature', (data) => {
        const retrievedAddy = web3.eth.accounts.recoverTransaction(data.signatureObject) ;
        if(pendingRequests[data.uID].address === retrievedAddy) {
            pendingRequests[data.uID].socketId.broadcast.emit('setOutput', {
                outputText: 'Success'
            })
        }
    });
});

server.listen(process.env.PORT, () => {
    console.log('Listening to port ' + process.env.PORT);
});
