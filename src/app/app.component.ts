import {Component} from '@angular/core';
import io from 'socket.io-client';
import {Web3ComponentsService} from "./web3-components.service";

interface LinkedDataInfo {
    href: String,
    title: String,
    iconPath: String,
    alt: String,
    width: number
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    web: any;
    origin: String = window.location.origin;
    socket = io(window.location.origin);

    twitterLI: LinkedDataInfo = {
        href: 'https://github.com/HentaiOusama/Simple-Base-dApp/tree/AngularBranch',
        title: 'GitHub',
        iconPath: 'assets/GitHub.svg',
        alt: 'Github Link',
        width: 30
    };

    constructor(_web3: Web3ComponentsService) {
        this.web = _web3;
    }
}
