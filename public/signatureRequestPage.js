const socket = io.connect(window.location.origin);

if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
} else {
    console.log('MetaMask is not installed!');
}

const pageURL = window.location.href;

let displayDiv;

window.onload = () => {
    displayDiv = document.getElementById('displayDiv');
};

let ethereum, web3;

ethereum = window.ethereum;
web3 = new Web3(ethereum);

const lastIndex = pageURL.lastIndexOf('/');
const signatureRequestId = pageURL.substring(lastIndex + 1, pageURL.length);

socket.emit('getCodeForSignature', {
    uID: signatureRequestId
});

socket.on('callDataSigner', (data) => {
    web3.eth.personal.sign("This transaction do not cost any gas / Eth. It is only to confirm your ownership of the account.",
        data.address, data.code).then((signature) => {
        socket.emit('verifySignature', {
            uID: signatureRequestId,
            signature: signature
        });
    }).catch((error) => {
        console.log("User Declined To Sign..." + error);
    });
});