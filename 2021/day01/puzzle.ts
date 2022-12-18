import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(7, 1722, 5, 1748);
  }

  parseInput(): void {
    this.input = this.input.map((i) => parseInt(i));
  }

  calculateAnswer1 = (): number => {
    let incremented = 0;
    for (let i = 1, len = this.input.length; i < len; i++) {
      if (this.input[i] > this.input[i - 1]) {
        incremented++;
      }
    }
    return incremented;
  };

  calculateAnswer2 = (): number => {
    let incremented = 0;
    for (let i = 3, len = this.input.length; i < len; i++) {
      let num1 = this.input[i - 3] + this.input[i - 2] + this.input[i - 1];
      let num2 = this.input[i - 2] + this.input[i - 1] + this.input[i];
      if (num2 > num1) {
        incremented++;
      }
    }
    return incremented;
  };
}

export const puzzle = new Puzzle('2021', '01', PuzzleStatus.COMPLETE);
