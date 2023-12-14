import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';

import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  map: Array2d<string> = new Array2d();

  setAnswers(): void {
    super.setAnswers(136, 105249, 0, 0);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split(''));
    this.map = new Array2d({ data: this.input });
  }

  calculateAnswer1 = (): number => {
    let answer = 0;

    const above = new Coordinate2d(0, -1);
    let changed = true;
    while (changed) {
      changed = false;
      for (const cell of this.map) {
        if (cell.coord.y == 0) {
          continue;
        }
        const coordAbove = cell.coord.copy().add(above);
        const valueAbove = this.map.getCell(coordAbove);
        if (valueAbove === '.' && cell.value === 'O') {
          this.map.setCell(coordAbove, 'O');
          this.map.setCell(cell.coord, '.');
          changed = true;
        }
      }
    }

    for (const cell of this.map) {
      if (cell.value === 'O') {
        answer += this.map.getHeight() - cell.coord.y;
      }
    }

    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;

    return answer;
  };
}

export const puzzle = new Puzzle('2023', '14', PuzzleStatus.IN_PROGRESS);
