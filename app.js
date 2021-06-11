const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const uIdV4 = require("uuid/v4");
const Web3 = require('web3');

const appURL = 'https://blockchain-reader-website.herokuapp.com/';
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.Web3Url));

app.get('*/web3.min.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/web3/dist/web3.min.js');
});

app.get('*/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});

app.get('*/signatureRequestPage.js', (req, res) => {
    res.sendFile(__dirname + '/public/signatureRequestPage.js');
});

app.get('/confirm-Signature/:uID', (req, res) => {
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

    socket.on('Get Signature Request URL', (data) => {
        const uniqueID = uIdV4();
        const verifyData = {
            url: appURL + 'confirm-Signature/' + uniqueID,
            address: data.address,
            code: uIdV4(),
            socketId: socket.id
        };

        pendingRequests[uniqueID] = verifyData;

        socket.emit('setOutput', {
            outputText: verifyData.url
        });
    });

    socket.on('getCodeForSignature', (data) => {
        socket.emit('callDataSigner', {
            code: pendingRequests[data.uID].code,
            address: pendingRequests[data.uID].address
        });
    });

    socket.on('verifySignature', (data) => {
        const pendingRequest = pendingRequests[data.uID];
        const retrievedAddy = web3.eth.accounts.recover("This transaction do not cost any gas / Eth. It is only to confirm your ownership of the account.",
            data.signature);
        if(pendingRequest.address === retrievedAddy) {
            io.to(pendingRequest.socketId).emit('setOutput', {
                outputText: 'Success'
            });
        } else {
            io.to(pendingRequest.socketId).emit('setOutput', {
                outputText: 'Failure'
            });
        }
    });
});

server.listen(process.env.PORT, () => {
    console.log('Listening to port ' + process.env.PORT);
});
