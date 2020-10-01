import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  input: string;
  hide = true;

  constructor() { }

  ngOnInit(): void {
  }

  onEnter(input): void {
    this.input = input;
    console.log(this.input);
  }

}
