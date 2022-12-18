import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  minVal: number = Infinity;
  maxVal: number = -Infinity;
  setAnswers(): void {
    super.setAnswers(37, 343605, 168, 96744904);
  }

  parseInput(): void {
    this.input = this.input
      .filter((v) => v)[0]
      .split(',')
      .map((n: string) => parseInt(n));
    this.minVal = Math.min(...this.input);
    this.maxVal = Math.max(...this.input);
  }

  calculateAnswer1 = (): number => {
    let minTotal = Infinity;
    let pos = -1;
    for (let i = this.minVal; i < this.maxVal; i++) {
      let total = 0;
      this.input.forEach((num) => {
        total += Math.abs(num - i);
      });
      if (total < minTotal) {
        pos = i;
        minTotal = total;
      }
    }
    return minTotal;
  };

  calculateAnswer2 = (): number => {
    let minTotal = Infinity;
    let pos = -1;
    for (let i = this.minVal; i < this.maxVal; i++) {
      let total = 0;
      this.input.forEach((num) => {
        let distance = Math.abs(num - i);
        total += (distance * (distance + 1)) / 2;
      });
      if (total < minTotal) {
        pos = i;
        minTotal = total;
      }
    }
    return minTotal;
  };
}

export const puzzle = new Puzzle('2021', '07', PuzzleStatus.COMPLETE);
