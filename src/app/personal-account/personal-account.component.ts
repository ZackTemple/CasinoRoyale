import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { PlayerTrackerError } from '../auth/player-tracker-error';
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
    this.authService.getPlayer(this.authService.playerUsername).subscribe(
      (player: IPlayer) => {
        this.player = player,
        this.earningsToLossesRatio = (this.player.totalEarned / this.player.totalLost);
      },
      (err: PlayerTrackerError) => console.log(err)
    );
  }

  onLogoutClick(): void {
    this.authService.signedIn$.next(false);
    this.authService.signOut();
    this.router.navigate(['/home']);
  }

}
