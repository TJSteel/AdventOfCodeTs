import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

const north = new Coordinate2d(0, -1);
const west = new Coordinate2d(-1, 0);
const south = new Coordinate2d(0, 1);
const east = new Coordinate2d(1, 0);

const tilt = (map: Array2d<string>, direction: Coordinate2d, walls: Coordinate2d[]): void => {
  for (const wall of walls) {
    let circles = 0;
    // count circles and mark .'s
    let next: Coordinate2d = wall.copy().subtract(direction);
    let nextValue = map.getCell(next);
    let cells = 0;
    while (nextValue && nextValue !== '#') {
      cells++;
      if (nextValue === 'O') {
        circles++;
      }
      next.subtract(direction);
      nextValue = map.getCell(next);
    }
    // if all cells are Os or .s then skip
    if (circles == 0 || circles == cells) {
      continue;
    }
    // set all cells to Os or .s with Os being first
    next = wall.copy();
    while (cells-- > 0) {
      next.subtract(direction);
      map.setCell(next, circles-- > 0 ? 'O' : '.');
    }
  }
};

const doSpinCycle = (map: Array2d<string>, walls: Coordinate2d[]): void => {
  tilt(map, north, walls);
  tilt(map, west, walls);
  tilt(map, south, walls);
  tilt(map, east, walls);
};

const getMapValue = (map: Array2d<string>): number => {
  let value = 0;
  for (const cell of map) {
    if (cell.value === 'O') {
      value += map.getHeight() - cell.coord.y;
    }
  }
  return value;
};

class Puzzle extends AbstractPuzzle {
  map: Array2d<string> = new Array2d();
  walls: Coordinate2d[] = [];

  setAnswers(): void {
    super.setAnswers(136, 105249, 64, 88680);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split(''));
    this.map = new Array2d({ data: this.input });
    // inner walls
    for (const cell of this.map) {
      if (cell.value === '#') {
        this.walls.push(cell.coord);
      }
    }
    // north/ south walls
    const height = this.map.getHeight();
    for (let y = 0; y < height; y++) {
      this.walls.push(new Coordinate2d(-1, y));
      this.walls.push(new Coordinate2d(height, y));
    }
    // east/ west walls
    const width = this.map.getWidth();
    for (let x = 0; x < width; x++) {
      this.walls.push(new Coordinate2d(x, -1));
      this.walls.push(new Coordinate2d(x, width));
    }
  }

  calculateAnswer1 = (): number => {
    tilt(this.map, north, this.walls);
    return getMapValue(this.map);
  };

  calculateAnswer2 = (): number => {
    let totalSpins = 1000000000;

    // we can memoize the calculations to reduce the run count of the heavy functions
    const cycles: Map<string, number> = new Map();
    const values: number[] = [];
    cycles.set(this.map.toString(), 0);
    values.push(getMapValue(this.map));

    for (let i = 1; i <= totalSpins; i++) {
      doSpinCycle(this.map, this.walls);
      const key = this.map.toString();
      if (cycles.has(key)) {
        // once we perform a cycle which we have already encountered before then we know that it will loop
        // we can find out which previous cycle in the loop we will land on at totalSpins using modulo
        const loopStart = cycles.get(key)!;
        const loopEnd = i;
        const loopLength = loopEnd - loopStart;
        const remainingCycles = (totalSpins - i) % loopLength;
        return values[loopStart + remainingCycles];
      } else {
        cycles.set(key, i);
        values.push(getMapValue(this.map));
      }
    }

    // we shouldn't ever reach this location
    return getMapValue(this.map);
  };
}

export const puzzle = new Puzzle('2023', '14', PuzzleStatus.COMPLETE);
