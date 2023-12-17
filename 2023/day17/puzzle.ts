import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

interface Node {
  coord: Coordinate2d;
  cost: number;
  direction: Coordinate2d;
  length: number;
}

class Puzzle extends AbstractPuzzle {
  map: Array2d<number> = new Array2d();

  setAnswers(): void {
    super.setAnswers(102, 1023, 0, 0);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split('').map((v: string) => parseInt(v)));
    this.map = new Array2d({ data: this.input });
  }

  calculateAnswer1 = (): number => {
    const startCoord = new Coordinate2d(0, 0);
    const endCoord = new Coordinate2d(this.map.getWidth() - 1, this.map.getHeight() - 1);
    let lowest = startCoord.manhattanDistance(endCoord) * 9;

    const queue: Node[] = [];

    const visited: Set<string> = new Set();
    for (const direction of Array2d.neighboursAdjacent) {
      const nextCoord = startCoord.copy();
      let cost = 0;
      for (let length = 1; length <= 3; length++) {
        nextCoord.add(direction);
        if (this.map.inRange(nextCoord)) {
          cost += this.map.getCell(nextCoord);
          visited.add(`${nextCoord.toString()}:${direction.toString()}:${length}`);
          queue.push({
            coord: nextCoord.copy(),
            cost,
            direction,
            length,
          });
        }
      }
    }

    while (queue.length > 0) {
      queue.sort((a, b) => b.cost - a.cost);
      const current: Node = queue.pop()!;
      if (current.cost + current.coord.manhattanDistance(endCoord) >= lowest) {
        continue;
      }

      if (current.coord.equals(endCoord)) {
        if (current.cost < lowest) {
          lowest = current.cost;
        }
        continue;
      }

      for (const direction of Array2d.neighboursAdjacent) {
        if (Math.abs(direction.x) == Math.abs(current.direction.x)) {
          continue;
        }
        const nextCoord = current.coord.copy();
        let cost = current.cost;
        for (let length = 1; length <= 3; length++) {
          nextCoord.add(direction);
          if (!this.map.inRange(nextCoord)) {
            break;
          }
          cost += this.map.getCell(nextCoord);
          const visitedKey = `${nextCoord.toString()}:${current.direction.toString()}:${length}`;
          if (!visited.has(visitedKey)) {
            visited.add(visitedKey);
            queue.push({
              coord: nextCoord.copy(),
              cost,
              direction,
              length,
            });
          }
        }
      }
    }

    return lowest;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;

    return answer;
  };
}

export const puzzle = new Puzzle('2023', '17', PuzzleStatus.IN_PROGRESS);
