import { Component } from '@angular/core';
import io from 'socket.io-client';
import { Web3ComponentsService } from "./web3-components.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'blockchain-reader';
  web: any
  socket = io(window.location.origin);

  constructor(_web3: Web3ComponentsService) {
    this.web = _web3;
  }
}
