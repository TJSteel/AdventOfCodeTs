import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  left: number[] = [];
  right: number[] = [];
  setAnswers(): void {
    super.setAnswers(11, 1222801, 31, 22545250);
  }

  parseInput(): void {
    this.left = [];
    this.right = [];
    this.input = this.input.map((i) => i.split('   ').map((v: string) => parseInt(v)));
    for (let value of this.input) {
      this.left.push(value[0]);
      this.right.push(value[1]);
    }
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    this.left.sort();
    this.right.sort();
    for (let i = 0; i < this.left.length; i++) {
      answer += Math.abs(this.left[i] - this.right[i]);
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;

    for (const left of this.left) {
      const count = this.right.filter((v) => v == left).length;
      answer += left * count;
    }

    return answer;
  };
}

export const puzzle = new Puzzle('2024', '01', PuzzleStatus.COMPLETE);
