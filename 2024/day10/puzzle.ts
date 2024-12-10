import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  map: Array2d<number> = new Array2d();

  setAnswers(): void {
    super.setAnswers(36, 798, 81, 1816);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split('').map((v: string) => parseInt(v)));
    this.map = new Array2d({ data: this.input });
  }

  getTrailheadScore(startCoord: Coordinate2d, distinct: boolean): number {
    let score = 0;
    if (this.map.getCell(startCoord) != 0) {
      return 0;
    }
    const queue = [{ coord: startCoord, height: 0 }];
    const peaks: Set<string> = new Set();
    while (queue.length > 0) {
      const current = queue.pop()!;
      for (const neighbour of this.map.getNeighboursAdjacent(current.coord)) {
        const neighbourHeight = this.map.getCell(neighbour);
        if (neighbourHeight === current.height + 1) {
          if (neighbourHeight === 9) {
            if (distinct) {
              score++;
            } else {
              if (!peaks.has(neighbour.toString())) {
                peaks.add(neighbour.toString());
                score++;
              }
            }
          } else {
            queue.push({ coord: neighbour, height: neighbourHeight });
          }
        }
      }
    }
    return score;
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    for (const cell of this.map) {
      answer += this.getTrailheadScore(cell.coord, false);
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    for (const cell of this.map) {
      answer += this.getTrailheadScore(cell.coord, true);
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2024', '10', PuzzleStatus.COMPLETE);
