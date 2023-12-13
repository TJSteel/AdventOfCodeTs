import { Array2d } from '../../core/array2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

const getHorizontalValue = (pattern: Array2d<string>, old: number = 0): number => {
  const rows = pattern.data.map((v) => v.join(''));
  outer: for (let i = 0; i < pattern.getHeight() - 1; i++) {
    let offset = 0;
    while (true) {
      const before = i - offset;
      const after = i + offset + 1;
      let beforeRow = rows[before];
      let afterRow = rows[after];

      if (!beforeRow || !afterRow) {
        const value = i + 1;
        if (value != old) {
          return value;
        }
        continue outer;
      }

      if (beforeRow != afterRow) {
        continue outer;
      }
      offset++;
    }
  }
  return 0;
};

const getVerticalValue = (pattern: Array2d<string>, old: number = 0): number => {
  const rotated: Array2d<string> = pattern.copy();
  rotated.rotateClockwise();
  return getHorizontalValue(rotated, old);
};

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(405, 34889, 400, 34224, { lowAnswers: { main2: [29268, 23795] } });
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
    for (let i = 0; i < this.input.length; i++) {
      const input = this.input[i];
      const pattern: Array2d<string> = input;
      let horizontalValue = getHorizontalValue(pattern);
      let verticalValue = getVerticalValue(pattern);
      let newHorizontalValue = 0;
      let newVerticalValue = 0;
      for (const cell of pattern) {
        const copyPattern = pattern.copy();
        copyPattern.setCell(cell.coord, copyPattern.getCell(cell.coord) == '.' ? '#' : '.');
        let vertical = getVerticalValue(copyPattern, verticalValue);
        let horizontal = getHorizontalValue(copyPattern, horizontalValue);
        if (vertical > 0) {
          newVerticalValue = vertical;
        }
        if (horizontal > 0) {
          newHorizontalValue = horizontal;
        }
      }
      answer += newHorizontalValue * 100;
      answer += newVerticalValue;
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2023', '13', PuzzleStatus.COMPLETE);
