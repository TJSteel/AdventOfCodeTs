import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

enum Direction {
  N,
  E,
  S,
  W,
}

interface Fence {
  innerCoord: Coordinate2d;
  outerCoord: Coordinate2d;
  direction: Direction;
}

const directions = [
  { direction: Direction.N, coord: new Coordinate2d(0, -1) },
  { direction: Direction.E, coord: new Coordinate2d(1, 0) },
  { direction: Direction.S, coord: new Coordinate2d(0, 1) },
  { direction: Direction.W, coord: new Coordinate2d(-1, 0) },
];

class Region {
  letter: string;
  cells: Coordinate2d[] = [];

  constructor(letter: string) {
    this.letter = letter;
  }

  getArea() {
    return this.cells.length;
  }
  getPerimeter(map: Array2d<string>): number {
    let perimeter: number = 0;
    for (const cell of this.cells) {
      const neighboursAdjacent = map.getNeighboursAdjacent(cell);
      for (const neighbour of map.getNeighboursAdjacent(cell)) {
        if (map.getCell(neighbour) != this.letter) {
          perimeter++;
        }
      }
      perimeter += 4 - neighboursAdjacent.length;
    }
    return perimeter;
  }
  getFencePieces(map: Array2d<string>): Fence[] {
    const fences: Fence[] = [];

    // build list of all fence pieces
    for (const cell of this.cells) {
      for (const direction of directions) {
        const coord = cell.copy().add(direction.coord);
        const value = map.getCell(coord);
        if (value == null || value !== this.letter) {
          fences.push({
            innerCoord: cell,
            outerCoord: coord,
            direction: direction.direction,
          });
        }
      }
    }

    return fences;
  }

  getDiscountedFenceCount(map: Array2d<string>): number {
    const fencePieces: Fence[] = this.getFencePieces(map);
    const visited: Set<string> = new Set();
    let price = 0;

    for (const fencePiece of fencePieces) {
      const key = `${fencePiece.innerCoord},${fencePiece.outerCoord}`;
      if (visited.has(key)) {
        continue;
      }
      price++;

      for (const direction of directions) {
        let innerCoord = fencePiece.innerCoord.copy().add(direction.coord);
        let outerCoord = fencePiece.outerCoord.copy().add(direction.coord);
        let connectedFencePiece = fencePieces.find(
          (piece) => piece.innerCoord.equals(innerCoord) && piece.outerCoord.equals(outerCoord)
        );
        while (connectedFencePiece) {
          visited.add(`${connectedFencePiece.innerCoord},${connectedFencePiece.outerCoord}`);
          innerCoord.add(direction.coord);
          outerCoord.add(direction.coord);
          connectedFencePiece = fencePieces.find(
            (piece) => piece.innerCoord.equals(innerCoord) && piece.outerCoord.equals(outerCoord)
          );
        }
      }

      visited.add(key);
    }

    return price;
  }
}

class Puzzle extends AbstractPuzzle {
  map: Array2d<string> = new Array2d();
  regions: Region[] = [];

  setAnswers(): void {
    super.setAnswers(1930, 1465112, 1206, 893790);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split(''));
    this.map = new Array2d({ data: this.input });
    this.regions = [];
    const visitedCells: Set<string> = new Set();
    for (const cell of this.map) {
      if (!visitedCells.has(cell.coord.toString())) {
        const region = new Region(cell.value);
        region.cells = this.map.getReachableCells(
          (cellValue) => cellValue == cell.value,
          cell.coord,
          Array2d.neighboursAdjacent
        );
        for (const visitedCell of region.cells) {
          visitedCells.add(visitedCell.toString());
        }
        this.regions.push(region);
      }
    }
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    for (const region of this.regions) {
      answer += region.getArea() * region.getFencePieces(this.map).length;
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    for (const region of this.regions) {
      answer += region.getArea() * region.getDiscountedFenceCount(this.map);
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2024', '12', PuzzleStatus.COMPLETE);
