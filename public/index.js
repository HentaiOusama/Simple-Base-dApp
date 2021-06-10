const socket = io.connect('https://blockchain-reader-website.herokuapp.com/');

if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
} else {
    console.log('MetaMask is not installed!');
}

let contractAddressInput, toAddressInput, fromAddressInput, amountInput, gasPriceInput, spenderAddressInput, queryAddressInput, outputBox;

window.onload = () => {
    contractAddressInput = document.getElementById('Contract_Address');
    toAddressInput = document.getElementById('To_Address');
    fromAddressInput = document.getElementById('From_Address');
    amountInput = document.getElementById('Amount');
    gasPriceInput = document.getElementById('Gas_Price');
    spenderAddressInput = document.getElementById('Spender_Address');
    queryAddressInput = document.getElementById('Query_Address');
    outputBox = document.getElementById('Output_Box');
}

let ethereum, web3, userAccount, networkId;

const setOutput = (text) => {
    outputBox.innerHTML = text;
}

ethereum = window.ethereum;
web3 = new Web3(ethereum);

const erc20ABI = [
    {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"tokenOwner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"remaining","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"newOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}
];

ethereum.on('chainChanged', () => {
    // Handle the new chain.
    // Correctly handling chain changes can be complicated.
    // We recommend reloading the page unless you have good reason not to.
    window.location.reload();
});

web3.eth.getAccounts().then((acc) => {
    userAccount = acc[0];
    console.log("Connected Account : " + userAccount);
});

ethereum.request({method: 'eth_requestAccounts'});

web3.eth.net.getId().then((id) => {
    networkId = id;
    console.log("Detected Network Id : " + networkId);
});

ethereum.on('accountsChanged', (acc) => {
    userAccount = acc[0];
    console.log("Account Changed to : " + userAccount);
});

async function getBalanceOf() {
    const erc20Token = new web3.eth.Contract(erc20ABI, web3.utils.toChecksumAddress(contractAddressInput.value));

    outputBox.innerHTML = await erc20Token.methods.balanceOf(queryAddressInput.value).call();
}

async function getTotalSupply() {
    const erc20Token = new web3.eth.Contract(erc20ABI, web3.utils.toChecksumAddress(contractAddressInput.value));

    outputBox.innerHTML = await erc20Token.methods.totalSupply().call();
}

async function getTokenName() {
    const erc20Token = new web3.eth.Contract(erc20ABI, web3.utils.toChecksumAddress(contractAddressInput.value));

    outputBox.innerHTML = await erc20Token.methods.name().call();
}

async function getTokenSymbol() {
    const erc20Token = new web3.eth.Contract(erc20ABI, web3.utils.toChecksumAddress(contractAddressInput.value));

    outputBox.innerHTML = await erc20Token.methods.symbol().call();
}

async function getTokenDecimals() {
    const erc20Token = new web3.eth.Contract(erc20ABI, web3.utils.toChecksumAddress(contractAddressInput.value));

    outputBox.innerHTML = await erc20Token.methods.decimals().call();
}

async function getTokenAllowance() {
    const erc20Token = new web3.eth.Contract(erc20ABI, web3.utils.toChecksumAddress(contractAddressInput.value));

    outputBox.innerHTML = await erc20Token.methods.allowance(fromAddressInput.value, spenderAddressInput.value).call();
}

async function sendTransfer() {
    const erc20Token = new web3.eth.Contract(erc20ABI, web3.utils.toChecksumAddress(contractAddressInput.value), {
        from: fromAddressInput.value,
        gasPrice: gasPriceInput.value + '000000000'
    });

    outputBox.innerHTML = JSON.stringify(await erc20Token.methods.transfer(toAddressInput.value, amountInput.value).send());
}

async function sendApprove() {
    const erc20Token = new web3.eth.Contract(erc20ABI, web3.utils.toChecksumAddress(contractAddressInput.value), {
        from: fromAddressInput.value,
        gasPrice: gasPriceInput.value + '000000000'
    });

    outputBox.innerHTML = JSON.stringify(await erc20Token.methods.approve(spenderAddressInput.value, amountInput.value).send());
}

async function sendTransferFrom() {
    const erc20Token = new web3.eth.Contract(erc20ABI, web3.utils.toChecksumAddress(contractAddressInput.value), {
        from: fromAddressInput.value,
        gasPrice: gasPriceInput.value + '000000000'
    });

    outputBox.innerHTML = JSON.stringify(await erc20Token.methods.transferFrom(fromAddressInput.value, toAddressInput.value, amountInput.value).send());
}