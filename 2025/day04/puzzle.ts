import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  map: Array2d<string> = new Array2d();

  setAnswers(): void {
    super.setAnswers(13, 1516, 43, 9122);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split(''));
    this.map = new Array2d({ data: this.input });
  }

  calculateAnswer1 = (): number => {
    let answer = 0;

    for (const cell of this.map) {
      if (cell.value === '@') {
        if (this.map.getNeighbours(cell.coord).filter((c: Coordinate2d) => this.map.getCell(c) === '@').length < 4) {
          answer++;
        }
      }
    }

    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    let removed = true;
    while (removed) {
      removed = false;
      for (const cell of this.map) {
        if (cell.value !== '@') {
          continue;
        }
        const neighbours = this.map.getNeighbours(cell.coord);

        if (neighbours.filter((c: Coordinate2d) => this.map.getCell(c) === '@').length < 4) {
          answer++;
          this.map.setCell(cell.coord, '.');
          removed = true;
        }
      }
    }

    return answer;
  };
}

export const puzzle = new Puzzle('2025', '04', PuzzleStatus.COMPLETE);
