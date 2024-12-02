import { Array2d } from '../../core/array2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

const isSafe = (numbers: number[]): boolean => {
  let current = numbers[0];
  const patternAscending = numbers[0] - numbers[1] < 0;

  for (let i = 1; i < numbers.length; i++) {
    const next = numbers[i];
    const diff = current - next;
    const diffAbs = Math.abs(diff);
    if (diffAbs > 3 || diffAbs < 1) {
      return false;
    }
    const ascending = diff < 0;
    if (ascending != patternAscending) {
      return false;
    }
    current = next;
  }
  return true;
};

class Puzzle extends AbstractPuzzle {
  map: Array2d<number> = new Array2d();

  setAnswers(): void {
    super.setAnswers(2, 299, 4, 364);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split(' ').map((v: string) => parseInt(v)));
    this.map = new Array2d({ data: this.input });
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    for (const input of this.input) {
      answer += isSafe(input) ? 1 : 0;
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    for (const input of this.input) {
      let safe = isSafe(input);
      if (!safe) {
        for (let i = 0; i < input.length; i++) {
          const subArray = [...input];
          subArray.splice(i, 1);
          safe = isSafe(subArray);
          if (safe) {
            break;
          }
        }
      }

      answer += safe ? 1 : 0;
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2024', '02', PuzzleStatus.COMPLETE);
