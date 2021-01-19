import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpTrackerError } from '../shared/http-tracker-error';
import { IPlayer } from '../interfaces/player';
import { SharedModule } from '../shared/shared.module';

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
    public router: Router) { }

  ngOnInit(): void {
    this.authService.getPlayer(this.authService.playerUsername).subscribe(
      (player: IPlayer) => {
        this.player = player,
        this.earningsToLossesRatio = (this.player.totalEarned / this.player.totalLost);
      },
      (err: HttpTrackerError) => console.log(err)
    );
  }

  onLogoutClick(): void {
    this.authService.signedIn$.next(false);
    this.authService.signOut();
    this.router.navigate(['/home']);
  }

}
