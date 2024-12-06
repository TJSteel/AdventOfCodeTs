import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  map: Array2d<string> = new Array2d();

  setAnswers(): void {
    super.setAnswers(41, 5409, 6, 2022);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split(''));
    this.map = new Array2d<string>({ data: this.input });
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    let currentCoord: Coordinate2d | null = this.map.find((v: any) => v.value == '^');
    if (!currentCoord) {
      throw new Error('Failed to find start');
    }
    currentCoord = currentCoord.copy();
    const directions = [
      new Coordinate2d(0, -1),
      new Coordinate2d(1, 0),
      new Coordinate2d(0, 1),
      new Coordinate2d(-1, 0),
    ];
    let directionIndex = 0;
    const visited: Set<string> = new Set<string>();
    while (this.map.inRange(currentCoord)) {
      if (this.map.getCell(currentCoord) == '#') {
        currentCoord.subtract(directions[directionIndex]);
        directionIndex++;
        if (directionIndex > 3) {
          directionIndex = 0;
        }
      } else {
        if (!visited.has(currentCoord.toString())) {
          answer++;
        }
        visited.add(currentCoord.toString());
      }
      currentCoord.add(directions[directionIndex]);
    }

    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    const startCoord: Coordinate2d | null = this.map.find((v: any) => v.value == '^');
    if (!startCoord) {
      throw new Error('Failed to find start');
    }

    for (const cell of this.map) {
      if (cell.value == '.') {
        const map = this.map.copy();
        map.setCell(cell.coord, '#');
        let currentCoord = startCoord.copy();
        const directions = [
          new Coordinate2d(0, -1),
          new Coordinate2d(1, 0),
          new Coordinate2d(0, 1),
          new Coordinate2d(-1, 0),
        ];
        let directionIndex = 0;
        const visited: Set<string> = new Set<string>();
        while (map.inRange(currentCoord)) {
          if (map.getCell(currentCoord) == '#') {
            currentCoord.subtract(directions[directionIndex]);
            directionIndex++;
            if (directionIndex > 3) {
              directionIndex = 0;
            }
          } else {
            const currentHash = currentCoord.toString() + directions[directionIndex].toString();
            if (visited.has(currentHash)) {
              answer++;
              break;
            }
            visited.add(currentHash);
          }
          currentCoord.add(directions[directionIndex]);
        }
      }
    }

    return answer;
  };
}

export const puzzle = new Puzzle('2024', '06', PuzzleStatus.INEFFICIENT);
