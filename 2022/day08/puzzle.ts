import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';

class Puzzle extends AbstractPuzzle {
  grid!: Array2d<any>;
  setAnswers(): void {
    super.setAnswers(21, 1711, 8, 301392);
  }

  parseInput(): void {
    this.input = this.input.map((v) =>
      v.split('').map((i: string) => {
        return { visible: false, value: parseInt(i) };
      })
    );
    this.grid = new Array2d({ height: this.input.length, width: this.input[0].length, data: this.input });
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    const height = this.grid.getHeight();
    const width = this.grid.getWidth();
    for (let y = 0; y < height; y++) {
      let max = -1;
      const cells = [];
      for (let x = 0; x < width; x++) {
        const cell = this.grid.getCell(new Coordinate2d(x, y));
        cells.push(cell);
        if (cell.value > max) {
          cell.visible = true;
          max = cell.value;
        }
      }
      max = -1;
      cells.reverse();
      for (const cell of cells) {
        if (cell.value > max) {
          cell.visible = true;
          max = cell.value;
        }
      }
    }
    for (let x = 0; x < width; x++) {
      let max = -1;
      const cells = [];
      for (let y = 0; y < height; y++) {
        const cell = this.grid.getCell(new Coordinate2d(x, y));
        cells.push(cell);
        if (cell.value > max) {
          cell.visible = true;
          max = cell.value;
        }
      }
      max = -1;
      cells.reverse();
      for (const cell of cells) {
        if (cell.value > max) {
          cell.visible = true;
          max = cell.value;
        }
      }
    }
    for (const cell of this.grid) {
      if (cell.value.visible) {
        answer++;
      }
    }

    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    const height = this.grid.getHeight();
    const width = this.grid.getWidth();
    let answerCell: any;
    for (const cell of this.grid) {
      if (cell) {
        let right: number = 0;
        let left: number = 0;
        let down: number = 0;
        let up: number = 0;
        for (let x = cell.coord.x + 1; x < width; x++) {
          const nextTree = this.grid.getCell(new Coordinate2d(x, cell.coord.y));
          right++;
          if (nextTree.value >= cell.value.value) {
            break;
          }
        }
        for (let x = cell.coord.x - 1; x >= 0; x--) {
          const nextTree = this.grid.getCell(new Coordinate2d(x, cell.coord.y));
          left++;
          if (nextTree.value >= cell.value.value) {
            break;
          }
        }
        for (let y = cell.coord.y + 1; y < height; y++) {
          const nextTree = this.grid.getCell(new Coordinate2d(cell.coord.x, y));
          down++;
          if (nextTree.value >= cell.value.value) {
            break;
          }
        }
        for (let y = cell.coord.y - 1; y >= 0; y--) {
          const nextTree = this.grid.getCell(new Coordinate2d(cell.coord.x, y));
          up++;
          if (nextTree.value >= cell.value.value) {
            break;
          }
        }

        const score = right * left * down * up;
        if (score > answer) {
          answer = score;
          answerCell = cell;
        }
      }
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2022', '08', PuzzleStatus.COMPLETE);
