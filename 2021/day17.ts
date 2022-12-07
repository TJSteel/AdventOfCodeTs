import { Coordinate2d } from '../core/coordinate2d';
import { PuzzleStatus } from '../core/enums';
import { AbstractPuzzle } from '../core/puzzle';
import { tjMath } from '../core/utils';

class Puzzle extends AbstractPuzzle {
  target: { from: Coordinate2d; to: Coordinate2d } = { from: new Coordinate2d(0, 0), to: new Coordinate2d(0, 0) };

  setAnswers(): void {
    super.setAnswers(45, 6441, 112, 3186);
  }

  parseInput(): void {
    let parts = this.input[0].split(' ');
    let x = parts[2]
      .split('x=')[1]
      .split(',')[0]
      .split('..')
      .map((n: string) => parseInt(n));
    let y = parts[3]
      .split('y=')[1]
      .split('..')
      .map((n: string) => parseInt(n));
    x = x.sort((a: number, b: number) => a - b);
    y = y.sort((a: number, b: number) => b - a);
    this.target = {
      from: new Coordinate2d(x[0], y[0]),
      to: new Coordinate2d(x[1], y[1]),
    };
  }

  calculateAnswer1 = (): number => {
    return tjMath.triangleNumber(Math.abs(this.target.to.y) - 1);
  };

  calculateAnswer2 = (): number => {
    let highestY = Math.abs(this.target.to.y) - 1;

    let lowestX = 0;
    while (tjMath.triangleNumber(lowestX) < this.target.from.x) {
      lowestX++;
    }
    let highestX = this.target.to.x;

    let distinct = 0;
    for (let y = this.target.to.y; y <= highestY; y++) {
      for (let x = lowestX; x <= highestX; x++) {
        let posX = 0;
        let posY = 0;
        let vX = x;
        let vY = y;
        while (posX < this.target.from.x || posY > this.target.from.y) {
          posX += vX;
          posY += vY;
          vX--;
          vY--;
          if (vX < 0) {
            vX = 0;
          }
        }
        if (
          posX >= this.target.from.x &&
          posX <= this.target.to.x &&
          posY <= this.target.from.y &&
          posY >= this.target.to.y
        ) {
          distinct++;
        }
      }
    }

    return distinct;
  };
}

export const puzzle = new Puzzle('2021', '17', PuzzleStatus.COMPLETE);
