"use strict";
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const uIdV4 = require("uuid/v4");
const Web3 = require('web3');

const _port = process.env.PORT;
const appURL = process.env.ServerUrl;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.Web3Url));

const _app_folder = __dirname + '/dist/blockchain-reader';

app.use(express.static(_app_folder));

// --- SERVE MODULES --- //
app.get('*/web3.min.js', (req, res) => {
  res.sendFile(__dirname + '/node_modules/web3/dist/web3.min.js');
});

app.get('*/socket.io.js', (req, res) => {
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});


// ---- SERVE STATIC FILES ---- //
app.get('*.*', express.static(_app_folder, {maxAge: '1y'}));

// ---- SERVE APPLICATION PATHS ---- //
app.all('*', function (req, res) {
  res.status(200).sendFile(`/`, {root: _app_folder});
});

// ---- START UP THE NODE SERVER  ---- //
server.listen(_port, () => {
  console.log("Node Express server for " + app.name + " listening on http://localhost:" + _port);
});


// --- Socket Listening and Handling --- //
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
