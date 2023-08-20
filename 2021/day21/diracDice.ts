import { DeterministicDice } from './deterministicDice';
import { Player } from './player';

interface Memoization {
  player1: number;
  player2: number;
  count: number;
}
interface DiceOutcome {
  score: number;
  count: number;
}

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

  getMostWins(): number {
    const diceOutcomes: DiceOutcome[] = [
      { score: 3, count: 1 },
      { score: 4, count: 3 },
      { score: 5, count: 6 },
      { score: 6, count: 7 },
      { score: 7, count: 6 },
      { score: 8, count: 3 },
      { score: 9, count: 1 },
    ];
    const memoization = new Map<string, Memoization>();
    const winStates: Set<string> = new Set();
    const queue: string[] = [];
    // build search queue
    const rootState = this.getState();
    memoization.set(rootState, { player1: 0, player2: 0, count: 1 });
    queue.push(rootState);
    let player1Wins = 0;
    let player2Wins = 0;

    // play all possible games to build memoized score
    while (queue.length > 0) {
      const previousState = queue.shift()!;
      for (const outcome of diceOutcomes) {
        this.loadState(previousState);
        this.playMove(outcome.score);
        const currentState = this.getState();

        const memo: Memoization = { ...memoization.get(previousState)! };
        memo.count *= outcome.count;

        if (memoization.has(currentState)) {
          memoization.get(currentState)!.count += memo.count; // TODO maybe even a *= here
        }

        memoization.set(currentState, memo);
        if (this.isGameOver()) {
          winStates.add(currentState);
          if (this.getWinner().name == 'Player 1') {
            player1Wins += memo.count;
          } else {
            player2Wins += memo.count;
          }
        } else {
          queue.push(currentState);
        }
      }
    }

    console.log(player1Wins);
    console.log(player2Wins);
    return Math.max(player1Wins, player2Wins);
  }

  isGameOver() {
    return this.gameOver;
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
