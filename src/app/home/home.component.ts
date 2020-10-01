import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css'
  ]
})
export class HomeComponent implements OnInit {

  pageTitle = 'Home';
  tiles = [
    {text: 'Local Game Play', cols: 3, rows: 1, class: 'single-player', route: '/games'},
    {text: 'Deposit Money', cols: 1, rows: 2, color: 'lightpink', class: 'deposit-money', route: '/deposit-money'},
    {text: 'Personal Account', cols: 2, rows: 1, color: 'lightgreen', class: 'personal-account', route: '/home'}, // change route later
    {text: 'Online Game Play', cols: 1, rows: 1, class: 'multi-player', route: '/home'}, // change route later
  ];

  constructor() { }

  ngOnInit(): void {
  }

}

