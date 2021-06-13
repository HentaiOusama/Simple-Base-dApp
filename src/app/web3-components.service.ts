import { Injectable } from '@angular/core';

const Web3 = require('web3/dist/web3.min');

declare let window: any;
declare let require: any;

@Injectable({
    providedIn: 'root'
})
export class Web3ComponentsService {

    constructor() {
        if (typeof window.ethereum !== "undefined") {
            window.web3 = new Web3(window.ethereum);
        } else {
            console.error('No Web3 Support Found. Please Consider Using MetaMask, etc');
        }
    }
}
