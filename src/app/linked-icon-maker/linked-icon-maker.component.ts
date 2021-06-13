import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-linked-icon-maker',
  templateUrl: './linked-icon-maker.component.html',
  styleUrls: ['./linked-icon-maker.component.css']
})
export class LinkedIconMakerComponent implements OnInit {
  @Input() href: String = '';
  @Input() title: String = '';
  @Input() iconPath: String = '';
  @Input() alt: String = '';
  @Input() width: number = 0;

  constructor() {
  }

  ngOnInit(): void {
  }
}
