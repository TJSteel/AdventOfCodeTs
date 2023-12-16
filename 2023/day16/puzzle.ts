import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

const directions = {
  UP: new Coordinate2d(0, -1),
  LEFT: new Coordinate2d(-1, 0),
  RIGHT: new Coordinate2d(1, 0),
  DOWN: new Coordinate2d(0, 1),
};
interface Queue {
  coord: Coordinate2d;
  direction: Coordinate2d;
}
class Puzzle extends AbstractPuzzle {
  map: Array2d<string> = new Array2d();

  setAnswers(): void {
    super.setAnswers(46, 8323, 0, 0);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split(''));
    this.map = new Array2d({ data: this.input });
  }

  calculateAnswer1 = (): number => {
    const visited: Set<string> = new Set();
    const energised: Set<string> = new Set();
    const start = new Coordinate2d(0, 0);
    const queue: Queue[] = [{ coord: start, direction: directions.RIGHT }];
    while (queue.length > 0) {
      const current: Queue = queue.pop()!;
      visited.add(`${current.coord.toString()},${current.direction.toString()}`);
      energised.add(current.coord.toString());

      const cell = this.map.getCell(current.coord);
      const nextDirections: Coordinate2d[] = [];
      switch (cell) {
        case '.':
          nextDirections.push(current.direction);
          break;
        case '/':
          if (current.direction.equals(directions.LEFT)) {
            nextDirections.push(directions.DOWN);
          } else if (current.direction.equals(directions.RIGHT)) {
            nextDirections.push(directions.UP);
          } else if (current.direction.equals(directions.UP)) {
            nextDirections.push(directions.RIGHT);
          } else if (current.direction.equals(directions.DOWN)) {
            nextDirections.push(directions.LEFT);
          }
          break;
        case '\\':
          if (current.direction.equals(directions.LEFT)) {
            nextDirections.push(directions.UP);
          } else if (current.direction.equals(directions.RIGHT)) {
            nextDirections.push(directions.DOWN);
          } else if (current.direction.equals(directions.UP)) {
            nextDirections.push(directions.LEFT);
          } else if (current.direction.equals(directions.DOWN)) {
            nextDirections.push(directions.RIGHT);
          }
          break;
        case '|':
          if (current.direction.equals(directions.LEFT) || current.direction.equals(directions.RIGHT)) {
            nextDirections.push(directions.UP);
            nextDirections.push(directions.DOWN);
          } else {
            nextDirections.push(current.direction);
          }
          break;
        case '-':
          if (current.direction.equals(directions.UP) || current.direction.equals(directions.DOWN)) {
            nextDirections.push(directions.LEFT);
            nextDirections.push(directions.RIGHT);
          } else {
            nextDirections.push(current.direction);
          }
          break;
      }

      for (const direction of nextDirections) {
        const coord = current.coord.copy().add(direction);
        if (!this.map.inRange(coord)) {
          continue;
        }
        const key = `${coord.toString()},${direction.toString()}`;
        if (!visited.has(key)) {
          queue.push({ coord, direction });
        }
      }
    }

    return energised.size;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;

    return answer;
  };
}

export const puzzle = new Puzzle('2023', '16', PuzzleStatus.IN_PROGRESS);
