import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  input: string;
  hide = true;
  username: string;
  password: string;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit(): void {
  }

  onClickEnter(): void {
    // call returns true if user could be logged in
    const logInSuccessful = this.authService.logIn(this.username, this.password);
    if (logInSuccessful) {
      this.router.navigate(['/home']);
    }
    else {
      console.log('login failed :(');
    }
  }
}
