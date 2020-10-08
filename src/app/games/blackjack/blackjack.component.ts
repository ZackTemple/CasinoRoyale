import { Component, OnInit } from '@angular/core';
import { stringify } from 'querystring';
import { IPlayer } from 'src/app/interfaces/player';
import { CardDeckService } from '../../card-deck/card-deck.service';
import { ICardBlackjack } from '../../interfaces/cards';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

export class BlackjackComponent implements OnInit {

  // decks
  deck: ICardBlackjack[];
  shuffledDeck: ICardBlackjack[];

  // Properties for handling the initial bet
  validBet = true;
  currentBet: number;
  betLockedIn = false;

  // Dealer and Player Hands
  dealerHand: ICardBlackjack[];
  playerHand: ICardBlackjack[];

  // User's turn and decision to hit or stay
  playersTurn = false;

  // Final winner or tie
  winner: string;
  tie = false;

  // User info from local storage
  playerInfo: IPlayer;


  constructor(private cardDeckService: CardDeckService) {
    this.playerInfo = JSON.parse(localStorage.getItem('Authorization')) as IPlayer;

    // TODO: fix database with Shawn
    this.playerInfo.totalEarned = Number(this.playerInfo.totalEarned);
    this.playerInfo.totalLost = Number(this.playerInfo.totalLost);
  }

  ngOnInit(): void {
    // Get deck of cards for Blackjack
    this.deck = this.cardDeckService.getBlackjackDeck();
  }

  onClickPlaceBet(): void {
    // Check to see if bet is valid
    if ( 0 < this.currentBet && this.currentBet <= this.playerInfo.currentMoney) {
      // Bet locked in, valid, and winner set to null and tie set to false here for easy restarts of the game
      this.betLockedIn = this.validBet = true;
      this.winner = null;
      this.tie = false;

      // Start game
      this.dealCardsToPlayers();
    }
    else {
      this.validBet = false;
    }
  }

  dealCardsToPlayers(): void {
    // shuffle deck on start of game
    this.shuffledDeck = this.cardDeckService.shuffleDeck(this.deck) as ICardBlackjack[];

    // distribute cards
    this.dealerHand = this.shuffledDeck.splice(0, 2);
    this.playerHand = this.shuffledDeck.splice(0, 2);
  }

  clickHit(): void {
    // refactor code below here, same as playDealersTurn
    const newCard = this.shuffledDeck.splice(0, 1);
    this.playerHand.push(newCard[0]);
    // add logic to catch if user busts
  }

  clickStay(): void {
    const playerScore = this.getScore(this.playerHand);
    this.playersTurn = false;

    // Finish the game after the player decides to stay
    this.finishGame(playerScore);
  }

  finishGame(playerScore: number): void {
    // Let dealer make moves
    const dealerScore = this.playDealersTurn(playerScore);

    // Decide the winner
    this.decideWinner(dealerScore, playerScore);

    // Update the player's info
    this.updatePlayerInfo();
  }

  playDealersTurn(playerScore: number): number {
    let dealerScore = this.getScore(this.dealerHand);
    let newCard: ICardBlackjack[];

    // Dealer keeps hitting until score is 17 or more or if it is greater than the player score
    while (dealerScore < 17  && dealerScore <= playerScore) {
      newCard = this.shuffledDeck.splice(0, 1);
      this.dealerHand.push(newCard[0]);
      dealerScore = this.getScore(this.dealerHand);
      // check to see if bust here
    }

    return dealerScore;
  }

  getScore(hand: ICardBlackjack[]): number {
    let totalScore = 0;

    hand.map(card => {
      totalScore += card.weight;
    });

    return totalScore;
  }

  decideWinner(dealerScore: number, playerScore: number): void {
    if (playerScore > dealerScore) {
      this.winner = this.playerInfo.username;
    }
    else if (dealerScore > playerScore) {
      this.winner = 'Dealer';
    }
    else if (playerScore === dealerScore) {
      this.tie = true;
    }
  }

  updatePlayerInfo(): void {

    // update player info depending on game results
    if (this.winner === this.playerInfo.username) {
      this.playerInfo.currentMoney += this.currentBet;
      this.playerInfo.totalEarned += this.currentBet;
    }
    else if (this.tie === true){}
    else {
      this.playerInfo.currentMoney -= this.currentBet;
      this.playerInfo.currentMoney -= this.currentBet;
    }
  }

  // ngOnDestroy() {
  //   const newPlayerInfo = JSON.stringify(this.playerInfo);
  //   localStorage.setItem('Authorization', newPlayerInfo);
  //   push changes to database
  // }

}
