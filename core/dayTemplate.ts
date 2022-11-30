import { PuzzleStatus } from './enums';
import { AbstractPuzzle } from './puzzle';

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(0, 0, 0, 0);
  }

  parseInput(): void {
    this.input = this.input.map((i) => parseInt(i));
  }

  calculateAnswer1 = (): number => {
    return this.input[0] + this.input[1];
  };

  calculateAnswer2 = (): number => {
    return this.input[0] * this.input[1];
  };
}

export const puzzle = new Puzzle('2022', 'Template', PuzzleStatus.IN_PROGRESS);
