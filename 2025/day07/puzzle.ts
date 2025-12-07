import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  map: Array2d<string> = new Array2d();

  setAnswers(): void {
    super.setAnswers(21, 1570, 40, 15_118_009_521_693);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split(''));
    this.map = new Array2d({ data: this.input });
  }

  calculateAnswer1 = (): number => {
    let splitCount = 0;

    for (let row = 0; row < this.map.getHeight(); row++) {
      for (let column = 0; column < this.map.getWidth(); column++) {
        const cell = this.map.getCell(new Coordinate2d(column, row));
        if (cell === 'S' || cell === '|') {
          const cellBelowCoord = new Coordinate2d(column, row + 1);
          const cellBelow = this.map.getCell(cellBelowCoord);

          if (cellBelow) {
            if (cellBelow === '^') {
              splitCount++;
              this.map.setCell(new Coordinate2d(column - 1, row + 1), '|');
              this.map.setCell(new Coordinate2d(column + 1, row + 1), '|');
            } else {
              this.map.setCell(cellBelowCoord, '|');
            }
          }
        }
      }
    }
    this.map.print();
    return splitCount;
  };

  getRayCount = (coord: Coordinate2d, memo: Map<string, number>): number => {
    if (memo.has(coord.toString())) {
      return memo.get(coord.toString())!;
    }
    let rayCount = 0;
    const memoKey = coord.toString();
    const cellBelowCoord = new Coordinate2d(coord.x, coord.y + 1);
    const cellBelow = this.map.getCell(cellBelowCoord);

    if (cellBelow) {
      if (cellBelow === '^') {
        rayCount += this.getRayCount(new Coordinate2d(cellBelowCoord.x - 1, cellBelowCoord.y), memo);
        rayCount += this.getRayCount(new Coordinate2d(cellBelowCoord.x + 1, cellBelowCoord.y), memo);
      } else {
        rayCount += this.getRayCount(cellBelowCoord, memo);
      }
    } else {
      rayCount = 1;
    }
    memo.set(memoKey, rayCount);
    return rayCount;
  };

  calculateAnswer2 = (): number => {
    const startCoord = this.map.find((v) => v.value === 'S')!;
    return this.getRayCount(startCoord, new Map<string, number>());
  };
}

export const puzzle = new Puzzle('2025', '07', PuzzleStatus.COMPLETE);
