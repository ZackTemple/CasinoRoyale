import { Component, OnInit } from '@angular/core';
import { CardDeckService } from 'src/app/card-deck.service';
import { ICard } from '../../interfaces/cards';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})
export class BlackjackComponent implements OnInit {

  deck: ICard[];

  constructor(private cardDeckService: CardDeckService) { }

  ngOnInit(): void {
    this.deck = this.cardDeckService.getDeckBlackjack();
    console.log(this.deck);
  }

}
