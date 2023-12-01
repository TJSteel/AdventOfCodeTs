import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

const numbers: { key: string; value: number }[] = [
  { key: '0', value: 0 },
  { key: '1', value: 1 },
  { key: '2', value: 2 },
  { key: '3', value: 3 },
  { key: '4', value: 4 },
  { key: '5', value: 5 },
  { key: '6', value: 6 },
  { key: '7', value: 7 },
  { key: '8', value: 8 },
  { key: '9', value: 9 },
  { key: 'zero', value: 0 },
  { key: 'one', value: 1 },
  { key: 'two', value: 2 },
  { key: 'three', value: 3 },
  { key: 'four', value: 4 },
  { key: 'five', value: 5 },
  { key: 'six', value: 6 },
  { key: 'seven', value: 7 },
  { key: 'eight', value: 8 },
  { key: 'nine', value: 9 },
];
const reversedNumbers: { key: string; value: number }[] = numbers.map((v) => {
  return {
    key: v.key.split('').reverse().join(''),
    value: v.value,
  };
});

const getFirstNumber = (string: string): number => {
  let lowest = Infinity;
  let value = 0;
  for (const number of numbers) {
    let index = string.indexOf(number.key);
    if (index < lowest && index > -1) {
      lowest = index;
      value = number.value;
    }
  }
  return value;
};
const getLastNumber = (string: string): number => {
  let reversedString = string.split('').reverse().join('');
  let lowest = Infinity;
  let value = 0;
  for (const number of reversedNumbers) {
    let index = reversedString.indexOf(number.key);
    if (index < lowest && index > -1) {
      lowest = index;
      value = number.value;
    }
  }
  return value;
};

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(209, 54338, 281, 53389);
  }

  parseInput(): void {}

  calculateAnswer1 = (): number => {
    this.input = this.input.map((value) =>
      value
        .split('')
        .filter((v: string) => !isNaN(parseInt(v)))
        .join('')
    );
    this.input = this.input.map((v) => {
      return parseInt(`${getFirstNumber(v)}${getLastNumber(v)}`);
    });
    return this.input.reduce((a, b) => a + b, 0);
  };

  calculateAnswer2 = (): number => {
    this.input = this.input.map((v) => {
      let first = getFirstNumber(v);
      let last = getLastNumber(v);
      return parseInt(`${first}${last}`);
    });
    return this.input.reduce((a, b) => a + b, 0);
  };
}

export const puzzle = new Puzzle('2023', '01', PuzzleStatus.COMPLETE);
