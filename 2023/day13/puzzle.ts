import { Array2d } from '../../core/array2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

const getHorizontalValue = (pattern: Array2d<string>): number => {
  const rows = pattern.data.map((v) => v.join(''));
  outer: for (let i = 0; i < pattern.getHeight() - 1; i++) {
    let offset = 0;
    while (true) {
      const before = i - offset;
      const after = i + offset + 1;
      let beforeRow = rows[before];
      let afterRow = rows[after];

      if (!beforeRow || !afterRow) {
        return i + 1;
      }

      if (beforeRow != afterRow) {
        continue outer;
      }
      offset++;
    }
  }
  return 0;
};

const getVerticalValue = (pattern: Array2d<string>): number => {
  const rotated: Array2d<string> = pattern.copy();
  rotated.rotateClockwise();
  return getHorizontalValue(rotated);
};

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(405, 34889, 0, 0);
  }

  parseInput(): void {
    this.input = this.input
      .join('\n')
      .split('\n\n')
      .map((v) => v.split('\n').map((v: string) => v.split('')))
      .map((v) => new Array2d({ data: v as any }));
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    for (const input of this.input) {
      const pattern: Array2d<string> = input;

      let horizontalValue = getHorizontalValue(pattern);
      let verticalValue = getVerticalValue(pattern);
      answer += horizontalValue * 100;
      answer += verticalValue;
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;

    return answer;
  };
}

export const puzzle = new Puzzle('2023', '13', PuzzleStatus.IN_PROGRESS);
