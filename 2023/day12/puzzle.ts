import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { tjMath } from '../../core/utils';

const getMinLength = (numbers: number[]): number => {
  return tjMath.sum(numbers) + numbers.length - 1;
};
const getGapCount = (numbers: number[]): number => {
  return numbers.length - 1;
};
const getGapSize = (sum: number, length: number): number => {
  return length - sum;
};

const isValidPattern = (pattern: string, numbers: number[]): boolean => {
  const parts = pattern.split('.').filter((v) => v);
  const length = parts.length;
  if (length != numbers.length) {
    return false;
  }
  for (let i = 0; i < length; i++) {
    if (parts[i].length != numbers[i]) {
      return false;
    }
  }

  return true;
};

const getPossibleArrangements = (pattern: string, numbers: number[]): number => {
  let arrangements: number = 0;

  if (getMinLength(numbers) == pattern.length) {
    return 1;
  }
  const questionMarks = pattern.split('').filter((v) => v == '?').length;
  const permutations = Math.pow(2, questionMarks);
  for (let i = 0; i < permutations; i++) {
    const bin = i.toString(2).split('');
    while (bin.length < questionMarks) {
      bin.unshift('0');
    }
    let newPattern = '';
    for (const char of pattern.split('')) {
      if (char == '?') {
        newPattern += bin.shift() == '1' ? '#' : '.';
      } else {
        newPattern += char;
      }
    }
    if (isValidPattern(newPattern, numbers)) {
      arrangements++;
    }
  }

  return arrangements;
};

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(21, 7843, 0, 0);
  }

  parseInput(): void {
    this.input = this.input.map((v) => {
      const parts = v.split(' ');
      return {
        pattern: parts[0],
        numbers: parts[1].split(',').map((i: string) => parseInt(i)),
      };
    });
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    this.input.forEach((v) => {
      const { pattern, numbers } = v;
      answer += getPossibleArrangements(pattern, numbers);
    });

    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    return answer;
  };
}

export const puzzle = new Puzzle('2023', '12', PuzzleStatus.IN_PROGRESS);
