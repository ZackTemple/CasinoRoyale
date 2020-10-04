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
    // Get deck of cards
    const deck = this.cardDeckService.getDeck();
    // Add weights to cards for Blackjack game
    const weightedDeck = this.cardDeckService.gatherWeightsForBlackjack(deck);
    // shuffle cards
    this.deck = this.cardDeckService.shuffleDeck(weightedDeck);
    console.log(this.deck);
  }

}
