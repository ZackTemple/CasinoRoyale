import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { IPlayer } from 'src/app/interfaces/player';
import { CardDeckService } from '../../card-deck/card-deck.service';
import { ICardBlackjack } from '../../interfaces/cards';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

export class BlackjackComponent implements OnInit, OnDestroy {

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

  // Final winner, tie, and bust
  winner: string;
  tie = false;
  bust = false;

  // User info from local storage
  playerInfo: IPlayer;
  dealer = {name: 'Dealer'};


  constructor(
    private cardDeckService: CardDeckService,
    private authService: AuthService) {
    this.playerInfo = JSON.parse(localStorage.getItem('Authorization')) as IPlayer;

    // TODO: fix database with Shawn
    this.playerInfo.totalEarned = Number(this.playerInfo.totalEarned);
    this.playerInfo.totalLost = Number(this.playerInfo.totalLost);

    console.log(this.playerInfo);
  }

  ngOnInit(): void {
    // Get deck of cards for Blackjack
    this.deck = this.cardDeckService.getBlackjackDeck();
  }

  onClickPlaceBet(): void {
    // Check to see if bet is valid
    if ( 0 < this.currentBet && this.currentBet <= this.playerInfo.currentMoney) {

      // Reset game attributes, like winners, ties, bust, etc, take bet from player wallet, and deal cards
      this.resetGameAttributes();
      this.subtractBetFromPlayerWallet();
      this.dealCardsToPlayers();
    }
    else {
      this.validBet = false;
    }
  }

  resetGameAttributes(): void {
    this.betLockedIn = this.validBet = true;
    this.winner = null;
    this.tie = false;
    this.bust = false;
  }

  subtractBetFromPlayerWallet(): void {
    this.playerInfo.currentMoney -= this.currentBet;
      this.playerInfo.totalLost -= this.currentBet;
  }

  dealCardsToPlayers(): void {
    // shuffle deck on start of game
    this.shuffledDeck = this.cardDeckService.shuffleDeck(this.deck) as ICardBlackjack[];

    // distribute cards
    this.dealerHand = this.shuffledDeck.splice(0, 1);
    this.playerHand = this.shuffledDeck.splice(0, 2);

    // Must check to see if user busts on deal
    this.playerBustQ(this.getScore(this.playerHand));
  }

  clickHit(): void {
    this.playerHand.push(this.newCard());

    // Check to see if user busts
    this.playerBustQ(this.getScore(this.playerHand));
  }

  newCard(): ICardBlackjack {
    return this.shuffledDeck.splice(0, 1)[0];
  }

  clickStay(): void {
    const playerScore = this.getScore(this.playerHand);
    this.playersTurn = false;

    this.finishGame(playerScore);
  }

  finishGame(playerScore: number): void {

    // Let dealer make moves, decide winner, and update player info with results
    const dealerScore = this.playDealersTurn(playerScore);
    this.decideWinner(dealerScore, playerScore);
    this.updatePlayerInfo();
  }

  playDealersTurn(playerScore: number): number {
    let dealerScore = this.getScore(this.dealerHand);

    // Dealer keeps hitting until score is 17 or more
    while (dealerScore < 17 || dealerScore < playerScore) {
      this.dealerHand.push(this.newCard());
      dealerScore = this.getScore(this.dealerHand);
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
    else if (dealerScore > 21) {
      this.winner = this.playerInfo.username;
    }
    else if (dealerScore > playerScore) {
      this.winner = this.dealer.name;
    }
    else if (playerScore === dealerScore) {
      this.tie = true;
    }
  }

  updatePlayerInfo(): void {

    // update player info depending on game results
    if (this.winner === this.playerInfo.username) {
      this.playerInfo.currentMoney += 2 * this.currentBet;
      this.playerInfo.totalEarned += 2 * this.currentBet;
    }
    else if (this.tie === true) {
      this.playerInfo.currentMoney += this.currentBet;
      this.playerInfo.totalEarned += this.currentBet;
    }
  }

  playerBustQ(score: number): void {
    if (score > 21) {
      this.bust = true;
      this.winner = this.dealer.name;
      this.updatePlayerInfo();
    }
  }


  ngOnDestroy(): void {
    const newPlayerInfo = JSON.stringify(this.playerInfo);
    localStorage.setItem('Authorization', newPlayerInfo);
    this.authService.updatePlayer(this.playerInfo).subscribe();
  }

}
