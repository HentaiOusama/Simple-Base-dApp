const socket = io.connect('http://localhost:4000');

if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
} else {
    console.log('MetaMask is not installed!');
}

let ethereum, web3, account, networkId;

ethereum = window.ethereum;
web3 = new Web3(ethereum);

ethereum.on('chainChanged', (chainId) => {
    // Handle the new chain.
    // Correctly handling chain changes can be complicated.
    // We recommend reloading the page unless you have good reason not to.
    window.location.reload();
});

web3.eth.getAccounts().then((acc) => {
    account = acc[0];
    console.log("Connected Account : " + account);
});

ethereum.request({method: 'eth_requestAccounts'});

web3.eth.net.getId().then((id) => {
    networkId = id;
    console.log("Detected Network Id : " + networkId);
});

ethereum.on('accountsChanged', (acc) => {
    account = acc[0];
    console.log("Account Changed to : " + account);
});
