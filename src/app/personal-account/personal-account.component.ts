import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { IPlayer } from '../interfaces/player';

@Component({
  selector: 'app-personal-account',
  templateUrl: './personal-account.component.html',
  styleUrls: ['./personal-account.component.css']
})
export class PersonalAccountComponent implements OnInit {

  userInfo: IPlayer;
  earningsToLossesRatio: number;

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.authService.currentPlayer$.subscribe(
      player => {
        this.userInfo = player;
        this.earningsToLossesRatio = (player.totalEarned / player.totalLost);
      }
    );
  }

  onLogoutClick(): void {
    this.authService.currentPlayer$.next(null);
    localStorage.removeItem('Authorization');
    this.authService.loggedIn$.next(false);
    this.router.navigate(['/home']);
  }

}
