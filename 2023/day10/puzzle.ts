import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

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

class Puzzle extends AbstractPuzzle {
  map: Array2d<string> = new Array2d();
  setAnswers(): void {
    super.setAnswers(70, 7102, 8, 363, { highAnswers: { main2: [422] } });
  }

  parseInput(): void {
    this.input.map((row) => row.split(''));
    this.map = new Array2d({ data: this.input });
  }

  calculateAnswer1 = (): number => {
    // run a bfs and the deepest path is the answer
    let startNode: Node;
    for (const cell of this.map) {
      if (cell.value === 'S') {
        startNode = { coord: cell.coord, depth: 0 };
        break;
      }
    }

    const queue: Node[] = [];
    const visited: Set<string> = new Set();
    queue.push(startNode!);
    visited.add(startNode!.coord.toString());
    let furthestCell = 0;
    while (queue.length > 0) {
      const current: Node = queue.shift()!;
      const cell = this.map.getCell(current.coord);
      const neighbours: Coordinate2d[] = this.map
        .getNeighbourGroup(current.coord, validPaths[cell as keyof typeof validPaths])
        .filter((coord: Coordinate2d) => {
          if (visited.has(coord.toString())) {
            return false;
          }
          // valid paths exist only if your neighbour has a neighbour pointing back
          const neighbour = this.map.getCell(coord);
          const neighboursBack = this.map
            .getNeighbourGroup(coord, validPaths[neighbour as keyof typeof validPaths])
            .filter((c) => c.equals(current.coord)).length;
          return neighboursBack > 0;
        });
      const depth = current.depth + 1;
      for (const neighbour of neighbours) {
        visited.add(neighbour.toString());
        queue.push({
          coord: neighbour,
          depth,
        });
        if (depth > furthestCell) {
          furthestCell = depth;
        }
      }
    }

    return furthestCell;
  };

  calculateAnswer2 = (): number => {
    // expand the map by putting an extra cell between everything so that we have a cell inbetween pipes and add a border around it all
    const expandedMap: Array2d<string> = new Array2d({
      width: this.map.getWidth() * 2 + 1,
      height: this.map.getHeight() * 2 + 1,
      defaultValue: '#',
    });
    for (let x = 0; x < this.map.getWidth(); x++) {
      for (let y = 0; y < this.map.getHeight(); y++) {
        const eX = x * 2 + 1;
        const eY = y * 2 + 1;
        expandedMap.setCell(new Coordinate2d(eX, eY), this.map.getCell(new Coordinate2d(x, y)));
      }
    }

    // loop all even rows and add in the vertical walls | where possible between north having a south path && south having a north path
    for (let y = 2; y < expandedMap.getHeight() - 1; y += 2) {
      for (let x = 1; x < expandedMap.getWidth(); x += 2) {
        let valid = true;
        const cellNorth = expandedMap.getCell(new Coordinate2d(x, y - 1));
        const cellSouth = expandedMap.getCell(new Coordinate2d(x, y + 1));
        if (!'S|7F'.includes(cellNorth)) valid = false;
        if (!'S|LJ'.includes(cellSouth)) valid = false;
        if (valid) expandedMap.setCell(new Coordinate2d(x, y), '|');
      }
    }

    // loop all odd rows and add in the horizontal walls - when possible between west having an east path && east having a west path
    for (let x = 2; x < expandedMap.getWidth(); x += 2) {
      for (let y = 1; y < expandedMap.getHeight() - 1; y += 2) {
        let valid = true;
        const cellWest = expandedMap.getCell(new Coordinate2d(x - 1, y));
        const cellEast = expandedMap.getCell(new Coordinate2d(x + 1, y));
        if (!'S-LF'.includes(cellWest)) valid = false;
        if (!'S-7J'.includes(cellEast)) valid = false;
        if (valid) expandedMap.setCell(new Coordinate2d(x, y), '-');
      }
    }

    // starting at S run a BFS to capture the loop wall cells

    let startNode: Coordinate2d;
    for (const cell of expandedMap) {
      if (cell.value === 'S') {
        startNode = cell.coord;
        break;
      }
    }

    const queue: Coordinate2d[] = [];
    const visited: Set<string> = new Set();
    const loopWalls: Set<string> = new Set();
    queue.push(startNode!);
    visited.add(startNode!.toString());
    loopWalls.add(startNode!.toString());
    while (queue.length > 0) {
      const current: Coordinate2d = queue.shift()!;
      const cell = expandedMap.getCell(current);
      const neighbours: Coordinate2d[] = expandedMap
        .getNeighbourGroup(current, validPaths[cell as keyof typeof validPaths])
        .filter((coord: Coordinate2d) => {
          if (visited.has(coord.toString())) {
            return false;
          }
          // valid paths exist only if your neighbour has a neighbour pointing back
          const neighbour = expandedMap.getCell(coord);
          const neighboursBack = expandedMap
            .getNeighbourGroup(coord, validPaths[neighbour as keyof typeof validPaths])
            .filter((c) => c.equals(current)).length;
          return neighboursBack > 0;
        });
      for (const neighbour of neighbours) {
        loopWalls.add(neighbour.toString());
        visited.add(neighbour.toString());
        queue.push(neighbour);
      }
    }
    for (const cell of expandedMap) {
      if (loopWalls.has(cell.coord.toString())) {
        expandedMap.setCell(cell.coord, 'O');
      } else if ('|-LJ7FS'.includes(cell.value)) {
        expandedMap.setCell(cell.coord, '.');
      }
    }

    // starting at cell 0,0 search for all reachable cells outside of the loop and mark any . as #

    queue.length = 0;
    startNode = new Coordinate2d(0, 0);
    queue.push(startNode);
    visited.clear();
    visited.add(startNode.toString());
    while (queue.length > 0) {
      const current: Coordinate2d = queue.shift()!;
      const neighbours: Coordinate2d[] = expandedMap.getNeighboursAdjacent(current);
      for (const neighbourCoord of neighbours) {
        const neighbourValue = expandedMap.getCell(neighbourCoord);
        if (visited.has(neighbourCoord.toString()) || neighbourValue === 'O') {
          continue;
        }
        visited.add(neighbourCoord.toString());
        expandedMap.setCell(neighbourCoord, '#');
        queue.push(neighbourCoord);
      }
    }

    // inside loop cell count = all remaining . but only at locations available if the map wasn't expanded

    let answer = 0;
    for (let x = 1; x < expandedMap.getWidth(); x += 2) {
      for (let y = 1; y < expandedMap.getHeight(); y += 2) {
        if (expandedMap.getCell(new Coordinate2d(x, y)) == '.') {
          answer++;
        }
      }
    }

    return answer;
  };
}

export const puzzle = new Puzzle('2023', '10', PuzzleStatus.COMPLETE);
