import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { TjMath } from '../../core/utils/math';

interface Node {
  coord: Coordinate2d;
  depth: number;
}

const directions = {
  north: new Coordinate2d(0, -1),
  east: new Coordinate2d(1, 0),
  south: new Coordinate2d(0, 1),
  west: new Coordinate2d(-1, 0),
};

const validPaths = {
  '|': [directions.north, directions.south],
  '-': [directions.west, directions.east],
  L: [directions.north, directions.east],
  J: [directions.north, directions.west],
  '7': [directions.west, directions.south],
  F: [directions.east, directions.south],
  '.': [],
  S: [directions.north, directions.east, directions.south, directions.west],
  '#': [],
};

/**
 * returns all points around the loop
 * @param map
 * @returns
 */
const getLoopPoints = (map: Array2d<string>): Coordinate2d[] => {
  const shoeLacePoints: Coordinate2d[] = [];
  let startCoord: Coordinate2d;
  for (const cell of map) {
    if (cell.value === 'S') {
      startCoord = cell.coord;
      break;
    }
  }

  shoeLacePoints.push(startCoord!);

  const queue: Coordinate2d[] = [startCoord!];
  const visited: Set<string> = new Set();
  visited.add(startCoord!.toString());

  while (queue.length > 0) {
    const currentCoord: Coordinate2d = queue.pop()!;
    const value = map.getCell(currentCoord);
    const neighbours: Coordinate2d[] = map
      .getNeighbourGroup(currentCoord, validPaths[value as keyof typeof validPaths])
      .filter((coord: Coordinate2d) => {
        if (visited.has(coord.toString())) {
          return false;
        }
        // valid paths exist only if your neighbour has a neighbour pointing back
        const neighbour = map.getCell(coord);
        const neighboursBack = map
          .getNeighbourGroup(coord, validPaths[neighbour as keyof typeof validPaths])
          .filter((c) => c.equals(currentCoord)).length;
        return neighboursBack > 0;
      });
    const neighbour = neighbours[0];

    if (!neighbour) {
      continue;
    }
    visited.add(neighbour.toString());
    shoeLacePoints.push(neighbour);
    queue.push(neighbour);
  }
  return shoeLacePoints;
};

class Puzzle extends AbstractPuzzle {
  map: Array2d<string> = new Array2d();
  setAnswers(): void {
    super.setAnswers(70, 7102, 8, 363);
  }

  parseInput(): void {
    this.input.map((row) => row.split(''));
    this.map = new Array2d({ data: this.input });
  }

  calculateAnswer1 = (): number => {
    return getLoopPoints(this.map).length / 2;
  };

  calculateAnswer2 = (): number => {
    const shoeLacePoints: Coordinate2d[] = getLoopPoints(this.map);

    const area = TjMath.polygonArea(shoeLacePoints);
    const circumference = shoeLacePoints.length / 2;

    return area - circumference + 1;
  };
}

export const puzzle = new Puzzle('2023', '10', PuzzleStatus.COMPLETE);
