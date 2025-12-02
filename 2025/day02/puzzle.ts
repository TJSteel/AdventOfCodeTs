import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

const isInvalidNumber = (num: number): boolean => {
  const numStr = num.toString();
  if (numStr.length % 2 == 1) return false;
  const midPoint = numStr.length / 2;
  const firstHalf = numStr.substring(0, midPoint);
  const secondHalf = numStr.substring(midPoint);
  return firstHalf == secondHalf;
};
const isInvalidNumberRepeating = (num: number): boolean => {
  const numStr = num.toString();
  const midPoint = numStr.length / 2;
  for (let len = 1; len <= midPoint; len++) {
    if (numStr.length % len != 0) continue;
    const set = new Set();
    for (let i = 0; i < numStr.length; i += len) {
      set.add(numStr.substring(i, i + len));
    }
    if (set.size == 1) return true;
  }

  return false;
};

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(1227775554, 24747430309, 4174379265, 30962646823);
  }

  parseInput(): void {
    this.input = this.input[0].split(',').map((line: string) => {
      const numbers = line.split('-').map(Number);
      return { start: numbers[0], end: numbers[1] };
    });
  }

  calculateAnswer1 = (): number => {
    let answer = 0;

    for (const range of this.input) {
      for (let i = range.start; i <= range.end; i++) {
        if (isInvalidNumber(i)) {
          answer += i;
        }
      }
    }

    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;

    for (const range of this.input) {
      for (let i = range.start; i <= range.end; i++) {
        if (isInvalidNumberRepeating(i)) {
          answer += i;
        }
      }
    }

    return answer;
  };
}

export const puzzle = new Puzzle('2025', '02', PuzzleStatus.COMPLETE);
