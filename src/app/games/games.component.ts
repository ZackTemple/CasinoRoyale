import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  tiles = [
    {},
    {text: 'Blackjack', cols: 1, rows: 2, class: 'blackjack', route: './blackjack'},
    {text: 'Texas Hold\'em', cols: 1, rows: 2, color: 'lightpink', class: 'texas-holdem', route: './texas-holdem'},
    {text: 'Omaha Hold\'em', cols: 1, rows: 2, color: 'lightpink', class: 'omaha-holdem', route: './omaha-holdem'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
