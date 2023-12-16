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

const getEnergisedCells = (map: Array2d<string>, start: Coordinate2d, startDirection: Coordinate2d): number => {
  const visited: Set<string> = new Set();
  const energised: Set<string> = new Set();
  const queue: Queue[] = [{ coord: start, direction: startDirection }];
  while (queue.length > 0) {
    const current: Queue = queue.pop()!;
    visited.add(`${current.coord.toString()},${current.direction.toString()}`);
    energised.add(current.coord.toString());

    const cell = map.getCell(current.coord);
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
      if (!map.inRange(coord)) {
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
class Puzzle extends AbstractPuzzle {
  map: Array2d<string> = new Array2d();

  setAnswers(): void {
    super.setAnswers(46, 8323, 51, 8491);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split(''));
    this.map = new Array2d({ data: this.input });
  }

  calculateAnswer1 = (): number => {
    return getEnergisedCells(this.map, new Coordinate2d(0, 0), directions.RIGHT);
  };

  calculateAnswer2 = (): number => {
    let maxEnergised = 0;

    for (let x = 0; x < this.map.getWidth(); x++) {
      let energised = getEnergisedCells(this.map, new Coordinate2d(x, 0), directions.DOWN);
      if (energised > maxEnergised) {
        maxEnergised = energised;
      }
      energised = getEnergisedCells(this.map, new Coordinate2d(x, this.map.getHeight() - 1), directions.UP);
      if (energised > maxEnergised) {
        maxEnergised = energised;
      }
    }
    for (let y = 0; y < this.map.getHeight(); y++) {
      let energised = getEnergisedCells(this.map, new Coordinate2d(0, y), directions.RIGHT);
      if (energised > maxEnergised) {
        maxEnergised = energised;
      }
      energised = getEnergisedCells(this.map, new Coordinate2d(this.map.getWidth() - 1, y), directions.LEFT);
      if (energised > maxEnergised) {
        maxEnergised = energised;
      }
    }

    return maxEnergised;
  };
}

// This can be made faster using memoization as we're checking the same paths multiple times
// eg look at the main input cell x: 1, y: 2, val: |
// we're checking the downwards path at least twice, one from starting above, another from starting from it's left
// using a recursive function to get energized cells with a directional memo map should be faster
export const puzzle = new Puzzle('2023', '16', PuzzleStatus.INEFFICIENT);
