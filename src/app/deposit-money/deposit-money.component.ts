import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { IPlayer } from '../interfaces/player';
import { browserRefresh } from '../app.component';

@Component({
  selector: 'app-deposit-money',
  templateUrl: './deposit-money.component.html',
  styleUrls: ['./deposit-money.component.css']
})
export class DepositMoneyComponent implements OnInit {

  player: IPlayer;
  moneyAdded = false;
  public browserRefresh: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.browserRefresh = browserRefresh;
    console.log('refreshed?:', browserRefresh);
    this.authService.getPlayer(this.authService.playerUsername).subscribe(
      (player: IPlayer) => this.player = player
    );
  }

  addMoney(): void {
    if ( this.player.currentMoney >= 500 ) {
      this.moneyAdded = false;
    }
    else {
      this.player.currentMoney = 500;
      this.authService.updatePlayer(this.player).subscribe();
      this.moneyAdded = true;
    }
  }

}
