import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  map: Array2d<string> = new Array2d();

  setAnswers(): void {
    super.setAnswers(18, 2536, 9, 1875);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split(''));
    this.map = new Array2d({ data: this.input });
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    const searchString = 'XMAS';
    for (const cell of this.map) {
      for (const direction of Array2d.neighbours) {
        let string = cell.value;
        let currentCoord = cell.coord.copy();
        for (let i = 0; i < 3; i++) {
          const neighbourCoord = currentCoord.add(direction);
          const neighbour = this.map.getCell(neighbourCoord);
          if (neighbour) {
            string += neighbour;
            currentCoord = neighbourCoord;
          } else {
            break;
          }
        }
        if (string == searchString) {
          answer++;
        }
      }
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;

    const neighboursDiagonal1 = [new Coordinate2d(-1, -1), new Coordinate2d(0, 0), new Coordinate2d(1, 1)];
    const neighboursDiagonal2 = [new Coordinate2d(1, -1), new Coordinate2d(0, 0), new Coordinate2d(-1, 1)];

    const searchString = 'MAS';
    const searchStringReverse = searchString.split('').reverse().join('');
    for (const cell of this.map) {
      const coords1 = neighboursDiagonal1.map((v) => cell.coord.copy().add(v));
      const coords2 = neighboursDiagonal2.map((v) => cell.coord.copy().add(v));
      const word1 = coords1.map((coord) => this.map.getCell(coord)).join('');
      const word2 = coords2.map((coord) => this.map.getCell(coord)).join('');
      if (
        (word1 == searchString || word1 == searchStringReverse) &&
        (word2 == searchString || word2 == searchStringReverse)
      ) {
        answer++;
      }
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2024', '04', PuzzleStatus.COMPLETE);
