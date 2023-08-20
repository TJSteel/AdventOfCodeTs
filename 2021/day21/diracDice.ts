import { DeterministicDice } from './deterministicDice';
import { Player } from './player';

interface Outcome {
  player1: number;
  player2: number;
  count: number;
}
interface DiceOutcome {
  score: number;
  count: number;
}

const diceOutcomes: DiceOutcome[] = [
  { score: 3, count: 1 },
  { score: 4, count: 3 },
  { score: 5, count: 6 },
  { score: 6, count: 7 },
  { score: 7, count: 6 },
  { score: 8, count: 3 },
  { score: 9, count: 1 },
];
export class DiracDice {
  private player1: Player;
  private player2: Player;
  private player1MoveNext: boolean = true;
  private maxScore: number;
  private debug: boolean = false;
  public static winFunctionCounts = 0;
  dice: DeterministicDice = new DeterministicDice(100);

  constructor(player1Position: number, player2Position: number, maxScore: number) {
    this.player1 = new Player('Player 1', player1Position);
    this.player2 = new Player('Player 2', player2Position);
    this.maxScore = maxScore;
  }

  getMostWins(previousOutcome: Outcome, state: string): Outcome {
    DiracDice.winFunctionCounts++;
    const outcome = { ...previousOutcome };

    this.loadState(state);
    if (this.isGameOver()) {
      if (this.getWinner().name == 'Player 1') {
        outcome.player1 += outcome.count;
      } else {
        outcome.player2 += outcome.count;
      }
      return outcome;
    }
    for (const diceOutcome of diceOutcomes) {
      let nodeOutcome = { ...previousOutcome };
      this.loadState(state);
      this.playMove(diceOutcome.score);
      nodeOutcome.count *= diceOutcome.count;
      nodeOutcome = this.getMostWins(nodeOutcome, this.getState());

      outcome.player1 += nodeOutcome.player1;
      outcome.player2 += nodeOutcome.player2;
    }
    return outcome;
  }

  isGameOver() {
    return this.player1.points >= this.maxScore || this.player2.points >= this.maxScore;
  }
  playMove(forcedRollScore?: number) {
    let diceScore: number = 0;
    if (forcedRollScore) {
      diceScore = forcedRollScore;
    } else {
      for (let i = 0; i < 3; i++) {
        diceScore += this.dice.getRoll();
      }
    }
    const player: Player = this.player1MoveNext ? this.player1 : this.player2;
    player.move(diceScore);
    if (this.debug)
      console.log(`${player.name} moved ${diceScore} to ${player.position} increasing their score to ${player.points}`);

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
  getState() {
    let state = this.player1MoveNext ? '1' : '2';
    state += ':';
    state += this.player1.getState();
    state += ':';
    state += this.player2.getState();
    return state;
  }
  loadState(state: string) {
    const parts = state.split(':');
    this.player1MoveNext = parts[0] == '1';
    this.player1.loadState(parts[1]);
    this.player2.loadState(parts[2]);
  }
}
