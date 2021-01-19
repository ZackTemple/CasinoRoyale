import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { homeTiles } from './home.tiles';
import {SharedModule} from '../shared/shared.module';

@Component({
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css'
  ]
})
export class HomeComponent implements OnInit {

  pageTitle = 'Home';
  tiles = homeTiles;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}

