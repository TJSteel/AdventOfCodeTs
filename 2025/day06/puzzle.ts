import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  sums: { numbers: number[]; operator: string }[] = [];
  setAnswers(): void {
    super.setAnswers(4277556, 4364617236318, 3263827, 9077004354241);
  }

  parseInput(): void {}

  parseInputAnswer1(): void {
    this.input = this.input.map((line) => line.split(' ').filter((n: string) => n.length > 0));
    this.sums = [];
    for (let column = 0; column < this.input[0].length; column++) {
      for (let row = 0; row < this.input.length; row++) {
        const value = this.input[row][column];
        if (value === '+' || value === '*') {
          this.sums[column].operator = value;
          continue;
        }
        if (!this.sums[column]) {
          this.sums[column] = { numbers: [], operator: '' };
        }
        this.sums[column].numbers.push(parseInt(value, 10));
      }
    }
  }

  parseInputAnswer2(): void {
    this.sums = [];
    const stringLength = this.input[0].length;
    let sumIndex = 0;
    for (let column = 0; column < stringLength; column++) {
      if (this.sums[sumIndex] === undefined) {
        this.sums[sumIndex] = { numbers: [], operator: '' };
      }
      let allBlanks = true;
      let numberString = '';
      for (let row = 0; row < this.input.length; row++) {
        const value = this.input[row][column];
        if (value === '+' || value === '*') {
          this.sums[sumIndex].operator = value;
          allBlanks = false;
          continue;
        }
        if (value !== ' ') {
          numberString += value;
          allBlanks = false;
        }
      }
      if (numberString.length > 0) {
        this.sums[sumIndex].numbers.push(parseInt(numberString, 10));
      }
      if (allBlanks) {
        sumIndex++;
      }
    }
  }

  calculateAnswer(): number {
    let answer = 0;

    for (const sum of this.sums) {
      if (sum.operator === '+') {
        answer += sum.numbers.reduce((a, b) => a + b, 0);
      } else if (sum.operator === '*') {
        answer += sum.numbers.reduce((a, b) => a * b, 1);
      }
    }

    return answer;
  }

  calculateAnswer1 = (): number => {
    this.parseInputAnswer1();
    return this.calculateAnswer();
  };

  calculateAnswer2 = (): number => {
    this.parseInputAnswer2();
    return this.calculateAnswer();
  };
}

export const puzzle = new Puzzle('2025', '06', PuzzleStatus.COMPLETE);
