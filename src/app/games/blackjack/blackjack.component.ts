import { Component, OnInit } from '@angular/core';
import { CardDeckService } from '../../card-deck/card-deck.service';
import { ICardBlackjack } from '../../interfaces/cards';
import * as _ from 'lodash';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})
export class BlackjackComponent implements OnInit {

  deck: ICardBlackjack[];

  constructor(private cardDeckService: CardDeckService) { }

  ngOnInit(): void {
    // Get deck of cards for Blackjack
    this.deck = this.cardDeckService.getBlackjackDeck();
    console.log( this.deck );
    const deck = this.cardDeckService.shuffleDeck(this.deck);

    //   Print out shuffled cards for testing
    console.log( deck );
  }


}
