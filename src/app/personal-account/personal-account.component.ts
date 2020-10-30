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

  player: IPlayer;
  earningsToLossesRatio: number;

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    //  this.player = JSON.parse(localStorage.getItem('Authorization'));
    this.player = this.authService.currentPlayer;
     this.earningsToLossesRatio = (this.player.totalEarned / this.player.totalLost);
  }

  onLogoutClick(): void {
    localStorage.removeItem('Authorization');
    this.authService.signedIn$.next(false);
    this.router.navigate(['/home']);
  }

}
