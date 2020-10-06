import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { IPlayer } from '../interfaces/player';

@Component({
  selector: 'app-deposit-money',
  templateUrl: './deposit-money.component.html',
  styleUrls: ['./deposit-money.component.css']
})
export class DepositMoneyComponent implements OnInit {

  player: IPlayer;
  currentMoney: number;
  moneyAdded = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentPlayer$.subscribe(
      player => {
        this.player = player;
        this.currentMoney = player.currentMoney;
      }
    );
  }

  addMoney(): void {
    if ( this.currentMoney >= 500 ) {
      this.moneyAdded = false;
    }
    else {
      this.player.currentMoney = 500;
      // do I need this?
      this.authService.currentPlayer$.next(this.player);
      this.authService.updatePlayer(this.player).subscribe();
      this.moneyAdded = true;
    }
  }

}
