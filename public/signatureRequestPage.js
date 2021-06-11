const socket = io.connect('https://blockchain-reader-website.herokuapp.com/');

if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
} else {
    console.log('MetaMask is not installed!');
}

const pageURL = window.location.href;

let displayDiv;

window.onload(() => {
    displayDiv = document.getElementById('displayDiv');
});

let ethereum, web3;

ethereum = window.ethereum;
web3 = new Web3(ethereum);

const lastIndex = pageURL.lastIndexOf('/');
const signatureRequestId = pageURL.substring(lastIndex + 1, pageURL.length);

socket.emit('getCodeForSignature', {
    uID: signatureRequestId
});

socket.on('callDataSigner', (code) => {
    web3.eth.sign(code.code, code.address).then((error, signature) => {
        socket.emit('verifySignature', {
            signatureObject: signature
        });
    });
});