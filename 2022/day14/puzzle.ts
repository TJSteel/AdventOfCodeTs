import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  points: Coordinate2d[] = [];
  paths: Array<Coordinate2d[]> = [];
  start: Coordinate2d = new Coordinate2d(500, 0);
  map: Array2d = new Array2d();
  min: Coordinate2d = new Coordinate2d(Infinity, Infinity);
  max: Coordinate2d = new Coordinate2d(0, 0);
  setAnswers(): void {
    super.setAnswers(24, 885, 93, 28691);
  }

  parseInput(): void {
    this.start = new Coordinate2d(500, 0);
    this.points = [this.start];
    this.paths = [];
    this.min = new Coordinate2d(Infinity, 0);
    this.max = new Coordinate2d(500, 0);
    this.input.forEach((i) => {
      const path = [];
      for (const point of i.split(' -> ')) {
        const [x, y] = point.split(',').map((v: string) => parseInt(v));
        const coord = new Coordinate2d(x, y);
        path.push(coord);
        this.points.push(coord);
        this.min.x = Math.min(this.min.x, coord.x);
        this.min.y = Math.min(this.min.y, coord.y);
        this.max.x = Math.max(this.max.x, coord.x);
        this.max.y = Math.max(this.max.y, coord.y);
      }
      this.paths.push(path);
    });

    this.max.x -= this.min.x;
    this.max.y -= this.min.y;
    for (const point of this.points) {
      point.x -= this.min.x;
      point.y -= this.min.y;
    }
  }

  buildMap() {
    this.map = new Array2d({ width: this.max.x + 1, height: this.max.y + 1, defaultValue: '.' });
    for (const path of this.paths) {
      for (let i = 0, len = path.length - 1; i < len; i++) {
        const start = path[i];
        const finish = path[i + 1];
        let startY = start.y;
        let finishY = finish.y;
        if (startY > finishY) {
          startY = finish.y;
          finishY = start.y;
        }
        let startX = start.x;
        let finishX = finish.x;
        if (startX > finishX) {
          startX = finish.x;
          finishX = start.x;
        }
        for (let y = startY; y <= finishY; y++) {
          for (let x = startX; x <= finishX; x++) {
            this.map.setCell(new Coordinate2d(x, y), '#');
          }
        }
      }
    }
  }
  fillMap(hitStartCell: boolean): number {
    let answer = 0;
    let current = new Coordinate2d(this.start.x, this.start.y);

    while (true) {
      const down = new Coordinate2d(current.x, current.y + 1);
      const left = new Coordinate2d(current.x - 1, current.y + 1);
      const right = new Coordinate2d(current.x + 1, current.y + 1);
      const downCell = this.map.getCell(down);
      const leftCell = this.map.getCell(left);
      const rightCell = this.map.getCell(right);
      if (downCell === null) {
        break;
      } else if (downCell === '.') {
        current = down;
      } else if (leftCell === null) {
        break;
      } else if (leftCell === '.') {
        current = left;
      } else if (rightCell === null) {
        break;
      } else if (rightCell === '.') {
        current = right;
      } else {
        this.map.setCell(current, 'O');
        answer++;
        if (current.equals(this.start)) {
          return answer;
        }
        current.x = this.start.x;
        current.y = this.start.y;
      }
    }
    return hitStartCell ? 0 : answer;
  }

  addMapFloor(extraWidth: number) {
    for (const point of this.points) {
      point.x += extraWidth;
    }
    this.max.x += extraWidth * 2;
    this.max.y += 2;
    this.paths.push([new Coordinate2d(0, this.max.y), new Coordinate2d(this.max.x, this.max.y)]);
  }

  calculateAnswer1 = (): number => {
    this.buildMap();
    return this.fillMap(false);
  };

  calculateAnswer2 = (): number => {
    this.addMapFloor(150);
    this.buildMap();
    return this.fillMap(true);
  };
}

export const puzzle = new Puzzle('2022', '14', PuzzleStatus.COMPLETE);
