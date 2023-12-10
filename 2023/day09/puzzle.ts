import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

const getNextNumber = (numbers: number[]): number => {
  let next = numbers[numbers.length - 1];
  while (true) {
    const difference: number[] = [];
    for (let i = 1; i < numbers.length; i++) {
      difference.push(numbers[i] - numbers[i - 1]);
    }
    numbers = difference;
    let diff = difference[difference.length - 1];
    if (difference.reduce((a, b) => a + b, 0) == 0) {
      break;
    }
    next += diff;
  }
  return next;
};
const getPreviousNumber = (numbers: number[]): number => {
  const differences: Array<number>[] = [numbers];

  while (true) {
    const difference: number[] = [];
    const lastDifference = differences[differences.length - 1];

    for (let i = 1; i < lastDifference.length; i++) {
      difference.push(lastDifference[i] - lastDifference[i - 1]);
    }
    differences.push(difference);
    if (difference.reduce((a, b) => a + b, 0) == 0) {
      break;
    }
  }

  let diff = 0;
  for (let i = differences.length - 2; i >= 0; i--) {
    diff = differences[i][0] - diff;
  }

  return diff;
};

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(114, 1702218515, 2, 925);
  }

  parseInput(): void {
    this.input = this.input.map((v) => v.split(' ').map((i: string) => parseInt(i)));
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    this.input.forEach((v) => (answer += getNextNumber(v)));
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    this.input.forEach((v) => (answer += getPreviousNumber(v)));
    return answer;
  };
}

export const puzzle = new Puzzle('2023', '09', PuzzleStatus.COMPLETE);
