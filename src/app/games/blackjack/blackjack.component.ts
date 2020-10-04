import { Component, OnInit } from '@angular/core';
import { CardDeckService } from 'src/app/card-deck.service';
import { ICardBlackjack } from '../../interfaces/cards';

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
    // Print out shuffled cards for testing
    console.log( this.cardDeckService.shuffleDeck(this.deck) );
  }


}
