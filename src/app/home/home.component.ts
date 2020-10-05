import { Component, OnInit } from '@angular/core';
import { homeTiles } from './home.tiles';

@Component({
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css'
  ]
})
export class HomeComponent implements OnInit {

  pageTitle = 'Home';
  tiles = homeTiles;

  constructor() { }

  ngOnInit(): void {
  }

}

