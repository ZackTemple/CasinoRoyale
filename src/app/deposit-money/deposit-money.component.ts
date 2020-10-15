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
  moneyAdded = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.player = JSON.parse(localStorage.getItem('Authorization'));
  }

  addMoney(): void {
    if ( this.player.currentMoney >= 500 ) {
      this.moneyAdded = false;
    }
    else {
      this.player.currentMoney = 500;
      // this.authService.updatePlayer(this.player).subscribe();
      localStorage.setItem('Authorization', JSON.stringify(this.player));
      this.moneyAdded = true;
    }
  }

}
