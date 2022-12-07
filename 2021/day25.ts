import { Array2d } from '../core/array2d';
import { Coordinate2d } from '../core/coordinate2d';
import { PuzzleStatus } from '../core/enums';
import { AbstractPuzzle } from '../core/puzzle';

class Puzzle extends AbstractPuzzle {
  map: Array2d = new Array2d();

  setAnswers(): void {
    super.setAnswers(58, 557, -1, -1);
  }

  parseInput(): void {
    this.map = new Array2d({
      width: this.input[0].length,
      height: this.input.length,
      defaultValue: '.',
      data: this.input.map((l) => l.split('')),
    });
  }

  step(): boolean {
    let moved = false;

    let oldMap = this.map.copy();
    // move east
    for (const cell of oldMap) {
      if (cell?.value === '>') {
        let newCoord = new Coordinate2d(cell.coord.x + 1, cell.coord.y);
        if (!oldMap.inRangeX(newCoord.x)) {
          newCoord.x = 0;
        }
        let newCell = oldMap.getCell(newCoord);
        if (newCell === '.') {
          this.map.setCell(cell.coord, '.');
          this.map.setCell(newCoord, '>');
          moved = true;
        }
      }
    }
    oldMap = this.map.copy();
    // move south
    for (const cell of oldMap) {
      if (cell?.value === 'v') {
        let newCoord = new Coordinate2d(cell.coord.x, cell.coord.y + 1);
        if (!oldMap.inRangeY(newCoord.y)) {
          newCoord.y = 0;
        }
        let newCell = oldMap.getCell(newCoord);
        if (newCell === '.') {
          this.map.setCell(cell.coord, '.');
          this.map.setCell(newCoord, 'v');
          moved = true;
        }
      }
    }

    return moved;
  }

  calculateAnswer1 = (): number => {
    let count = 0;
    do {
      count++;
    } while (this.step());

    return count;
  };

  calculateAnswer2 = (): number => {
    return this.input[0] * this.input[1];
  };
}

export const puzzle = new Puzzle('2021', '25', PuzzleStatus.NOT_SOLVED);
