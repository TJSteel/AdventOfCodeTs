import { Array2d, Coordinate } from '../core/array2d';
import { PuzzleStatus } from '../core/enums';
import { AbstractPuzzle } from '../core/puzzle';

interface Queue {
  cost: number;
  coord: Coordinate;
}

class Puzzle extends AbstractPuzzle {
  map: Array2d = new Array2d();

  setAnswers(): void {
    super.setAnswers(40, 589, 315, 2885);
  }

  parseInput(): void {
    this.input = this.input.map((i) =>
      i.split('').map((n: string) => {
        return { risk: parseInt(n), cost: 99999999999 };
      })
    );
    let yLen = this.input.length;
    let xLen = this.input[0].length;
    this.map = new Array2d({ width: xLen, height: yLen, data: this.input });
  }

  increaseMapSize(): void {
    let newMap = new Array2d({
      width: this.map.getWidth() * 5,
      height: this.map.getHeight() * 5,
      defaultValue: { risk: 0, cost: 99999999999 },
    });
    for (let cell of this.map) {
      newMap.setCell(cell!.coord, cell!.value);
    }
    let oX = this.map.getWidth();
    let oY = this.map.getHeight();
    let nX = newMap.getWidth();
    let nY = newMap.getHeight();
    for (let y = 0; y < oY; y++) {
      for (let x = oX; x < nX; x++) {
        let cell = newMap.getCell({ x, y });
        let offsetCell = newMap.getCell({ x: x - oX, y });
        cell.risk = offsetCell.risk + 1;
        if (cell.risk > 9) {
          cell.risk = 1;
        }
      }
    }
    for (let y = oY; y < nY; y++) {
      for (let x = 0; x < nX; x++) {
        let cell = newMap.getCell({ x, y });
        let offsetCell = newMap.getCell({ x, y: y - oY });
        cell.risk = offsetCell.risk + 1;
        if (cell.risk > 9) {
          cell.risk = 1;
        }
      }
    }
    this.map = newMap;
  }

  findBestPath(): number {
    let queue: Queue[] = [];
    let bestCost = (this.map.getWidth() + this.map.getHeight()) * 9;
    let start = { x: 0, y: 0 };
    let end = { x: this.map.getWidth() - 1, y: this.map.getHeight() - 1 };
    this.map.getCell(start).cost = 0;

    for (let neighbour of this.map.getNeighboursAdjacent(start)) {
      let cell = this.map.getCell(neighbour);
      queue.push({
        cost: cell.risk,
        coord: neighbour,
      });
    }
    while (queue.length > 0) {
      let current: Queue = queue.pop()!;
      for (let neighbour of this.map.getNeighboursAdjacent(current.coord)) {
        let cell = this.map.getCell(neighbour);
        let cost = current.cost + cell.risk;
        if (cost < cell.cost && cost < bestCost) {
          cell.cost = cost;
          if (neighbour.x === end.x && neighbour.y === end.y) {
            bestCost = cost;
          } else {
            queue.push({
              cost,
              coord: neighbour,
            });
          }
        }
      }
    }

    return bestCost;
  }

  calculateAnswer1 = (): number => {
    return this.findBestPath();
  };

  calculateAnswer2 = (): number => {
    this.increaseMapSize();
    return this.findBestPath();
  };
}

export const puzzle = new Puzzle('2021', '15', PuzzleStatus.INEFFICIENT);
