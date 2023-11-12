import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { DiracDice } from './diracDice';

class Puzzle extends AbstractPuzzle {
  game!: DiracDice;
  setAnswers(): void {
    super.setAnswers(739785, 853776, 444356092776315, 301304993766094);
  }

  parseInput(): void {
    this.input = this.input.map((s: string) => parseInt(s.split(': ')[1]));
  }

  calculateAnswer1 = (): number => {
    this.game = new DiracDice(this.input[0], this.input[1], 1000);
    // this.game.setDebug(true);
    while (!this.game.isGameOver()) {
      this.game.playMove();
    }
    const loser = this.game.getLoser();
    const dice = this.game.dice;
    return loser.points * dice.getRolls();
  };

  calculateAnswer2 = (): number => {
    this.game = new DiracDice(this.input[0], this.input[1], 21);
    const outcome = this.game.getMostWins({ player1: 0, player2: 0, count: 1 }, this.game.getState());
    console.log(DiracDice.winFunctionCounts);
    return outcome.player1 > outcome.player2 ? outcome.player1 : outcome.player2;
  };
}
// takes almost 10 mins to solve
export const puzzle = new Puzzle('2021', '21', PuzzleStatus.INEFFICIENT);
