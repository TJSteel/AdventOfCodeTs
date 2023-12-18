import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

interface DigPlan {
  direction: string;
  distance: number;
  hexCode: string;
}

const directions = {
  U: new Coordinate2d(0, -1),
  D: new Coordinate2d(0, 1),
  L: new Coordinate2d(-1, 0),
  R: new Coordinate2d(1, 0),
};

class Puzzle extends AbstractPuzzle {
  map: Array2d<string> = new Array2d();

  setAnswers(): void {
    super.setAnswers(62, 42317, 0, 0);
  }

  parseInput(): void {
    this.input = this.input.map((i): DigPlan => {
      const parts = i.split(' ');
      return {
        direction: parts[0],
        distance: parseInt(parts[1]),
        hexCode: parts[2].replace(/[\(\#\)]/g, ''),
      };
    });
    this.map = new Array2d<string>({ width: 1, height: 1, defaultValue: '.' });
    this.map.setCell(new Coordinate2d(0, 0), '#');
  }

  calculateAnswer1 = (): number => {
    const currentCoord = new Coordinate2d(0, 0);
    for (const digPlan of this.input) {
      for (let i = digPlan.distance; i > 0; i--) {
        const direction: Coordinate2d = directions[digPlan.direction as keyof typeof directions];
        currentCoord.add(direction);
        if (!this.map.inRange(currentCoord)) {
          // extend the map and subtract the direction to put us back in range if negative
          if (currentCoord.x < 0) {
            this.map.addColumn('.'.repeat(this.map.getHeight()).split(''), 0);
            currentCoord.x = 0;
          } else if (currentCoord.x >= this.map.getWidth()) {
            this.map.addColumn('.'.repeat(this.map.getHeight()).split(''));
          }
          if (currentCoord.y < 0) {
            this.map.addRow('.'.repeat(this.map.getWidth()).split(''), 0);
            currentCoord.y = 0;
          } else if (currentCoord.y >= this.map.getHeight()) {
            this.map.addRow('.'.repeat(this.map.getWidth()).split(''));
          }
        }
        this.map.setCell(currentCoord, '#');
      }
    }
    this.map.addColumn('.'.repeat(this.map.getHeight()).split(''), 0);
    this.map.addColumn('.'.repeat(this.map.getHeight()).split(''));
    this.map.addRow('.'.repeat(this.map.getWidth()).split(''), 0);
    this.map.addRow('.'.repeat(this.map.getWidth()).split(''));

    const unfilledCells = this.map.countReachableCells(
      (cell) => cell == '.',
      new Coordinate2d(0, 0),
      Array2d.neighboursAdjacent
    );
    const filledCells = this.map.getHeight() * this.map.getWidth() - unfilledCells;
    return filledCells;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;

    return answer;
  };
}

export const puzzle = new Puzzle('2023', '18', PuzzleStatus.IN_PROGRESS);
