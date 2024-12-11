import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  memo: Map<string, number> = new Map();
  setAnswers(): void {
    super.setAnswers(55312, 202019, 65601038650482, 239321955280205);
  }

  parseInput(): void {
    this.input = this.input[0].split(' ').map(Number);
  }

  blink(num: number, depth: number): number {
    const key = `${num},${depth}`;
    if (this.memo.has(key)) {
      return this.memo.get(key)!;
    }
    const numStr = `${num}`;
    const numLength = numStr.length;
    let returnValue = 0;
    if (depth == 0) {
      returnValue = 1;
    } else if (num == 0) {
      returnValue = this.blink(1, depth - 1);
    } else if (numLength % 2 == 0) {
      returnValue =
        this.blink(parseInt(numStr.substring(0, numLength / 2)), depth - 1) +
        this.blink(parseInt(numStr.substring(numLength / 2)), depth - 1);
    } else {
      returnValue = this.blink(num * 2024, depth - 1);
    }
    this.memo.set(key, returnValue);
    return returnValue;
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    for (const number of this.input) {
      answer += this.blink(number, 25);
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    for (const number of this.input) {
      answer += this.blink(number, 75);
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2024', '11', PuzzleStatus.COMPLETE);
