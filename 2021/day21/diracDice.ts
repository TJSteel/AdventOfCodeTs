import { DeterministicDice } from './deterministicDice';
import { Player } from './player';

export class DiracDice {
  private player1: Player;
  private player2: Player;
  private player1MoveNext: boolean = true;
  private maxScore: number;
  private gameOver: boolean = false;
  private debug: boolean = false;
  dice: DeterministicDice = new DeterministicDice(100);

  constructor(player1Position: number, player2Position: number, maxScore: number) {
    this.player1 = new Player('Player 1', player1Position);
    this.player2 = new Player('Player 2', player2Position);
    this.maxScore = maxScore;
  }
  isGameOver() {
    return this.gameOver;
  }
  playMove() {
    let diceScore: number = 0;
    for (let i = 0; i < 3; i++) {
      diceScore += this.dice.getRoll();
    }
    const player: Player = this.player1MoveNext ? this.player1 : this.player2;
    player.move(diceScore);
    if (this.debug)
      console.log(`${player.name} moved ${diceScore} to ${player.position} increasing their score to ${player.points}`);
    if (player.points >= this.maxScore) {
      this.gameOver = true;
    }
    this.player1MoveNext = !this.player1MoveNext;
  }
  getWinner() {
    return this.player1.points > this.player2.points ? this.player1 : this.player2;
  }
  getLoser() {
    return this.player1.points < this.player2.points ? this.player1 : this.player2;
  }
  setDebug(debug: boolean) {
    this.debug = debug;
  }
}
