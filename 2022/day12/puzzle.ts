import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

interface Cell {
  height: number;
  visited: boolean;
}

interface Node {
  coord: Coordinate2d;
  cell: Cell;
  distance: number;
}

class Puzzle extends AbstractPuzzle {
  map!: Array2d<any>;
  start!: Coordinate2d;
  end!: Coordinate2d;
  setAnswers(): void {
    super.setAnswers(31, 361, 29, 354);
  }

  parseInput(): void {
    const height = this.input.length;
    const width = this.input[0].length;
    this.input = this.input.map((v: string, y: number) =>
      v.split('').map((v: string, x: number) => {
        let char = v.charAt(0);
        let code = v.charCodeAt(0) - 97;
        if (char == 'S') {
          this.start = new Coordinate2d(x, y);
          code = 0;
        } else if (char == 'E') {
          this.end = new Coordinate2d(x, y);
          code = 25;
        }
        return { height: code, visited: false } as Cell;
      })
    );
    this.map = new Array2d({ height, width, defaultValue: 0, data: this.input });
  }

  resetVisited() {
    for (const cell of this.map) {
      cell.value.visited = false;
    }
  }

  findPath(start: Coordinate2d): number | null {
    this.resetVisited();
    const queue: Node[] = [{ coord: start, cell: this.map.getCell(start), distance: 0 }];
    while (queue.length > 0) {
      const current: Node = queue.shift()!;
      if (!current || current.cell.visited) continue;
      current.cell.visited = true;
      if (current.coord.equals(this.end)) {
        return current.distance;
      }
      for (const neighbourCoord of this.map.getNeighboursAdjacent(current.coord)) {
        const neighbour = this.map.getCell(neighbourCoord);
        if (neighbour.visited) {
          continue;
        }
        if (neighbour.height - 1 <= current.cell.height) {
          queue.push({ coord: neighbourCoord, cell: neighbour, distance: current.distance + 1 });
        }
      }
    }
    return null;
  }

  calculateAnswer1 = (): number => {
    const distance = this.findPath(this.start);
    return distance || -1;
  };

  calculateAnswer2 = (): number => {
    let shortest = Infinity;
    for (const cell of this.map) {
      if (cell.value.height == 0) {
        let distance = this.findPath(cell.coord);
        if (distance) {
          shortest = Math.min(distance, shortest);
        }
      }
    }
    return shortest;
  };
}

export const puzzle = new Puzzle('2022', '12', PuzzleStatus.COMPLETE);
