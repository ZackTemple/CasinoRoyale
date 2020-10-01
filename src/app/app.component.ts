import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Casino Royale';
  loggedIn = false;

  toggleLogIn(): void {
    this.loggedIn = !this.loggedIn;
  }
}
