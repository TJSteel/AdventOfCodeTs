import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { TjMath } from '../../core/utils/math';

class Prize {
  buttonA: Coordinate2d;
  buttonB: Coordinate2d;
  prize: Coordinate2d;
  constructor() {
    this.buttonA = new Coordinate2d(0, 0);
    this.buttonB = new Coordinate2d(0, 0);
    this.prize = new Coordinate2d(0, 0);
  }
}

class Puzzle extends AbstractPuzzle {
  prizes: Prize[] = [];
  setAnswers(): void {
    super.setAnswers(480, 31552, 875318608908, 95273925552482);
  }

  parseInput(): void {
    this.prizes = [];
    let prize: Prize = new Prize();
    for (const line of this.input) {
      if (line.includes('Button A')) {
        prize.buttonA = new Coordinate2d(parseInt(line.split('X')[1].split(',')[0]), parseInt(line.split('Y')[1]));
      } else if (line.includes('Button B')) {
        prize.buttonB = new Coordinate2d(parseInt(line.split('X')[1].split(',')[0]), parseInt(line.split('Y')[1]));
      } else if (line.includes('Prize')) {
        prize.prize = new Coordinate2d(parseInt(line.split('X=')[1].split(',')[0]), parseInt(line.split('Y=')[1]));
        this.prizes.push(prize);
        prize = new Prize();
      }
    }
  }

  calculateAnswer = (): number => {
    let answer = 0;
    for (const prize of this.prizes) {
      const aDist = TjMath.Triangle.getDistance(prize.buttonA);
      const bDist = TjMath.Triangle.getDistance(prize.buttonB);
      const hypotenuseAngle = TjMath.Triangle.getAngleDegrees(prize.prize);

      const aAngle = Math.abs(hypotenuseAngle - TjMath.Triangle.getAngleDegrees(prize.buttonA));
      const bAngle = Math.abs(hypotenuseAngle - TjMath.Triangle.getAngleDegrees(prize.buttonB));
      const cAngle = 180 - aAngle - bAngle;

      const lengthHypotenuse = TjMath.Triangle.getDistance(prize.prize);
      const lengthA =
        (lengthHypotenuse * Math.sin(TjMath.degreesToRadians(bAngle))) / Math.sin(TjMath.degreesToRadians(cAngle));
      const lengthB =
        (lengthHypotenuse * Math.sin(TjMath.degreesToRadians(aAngle))) / Math.sin(TjMath.degreesToRadians(cAngle));

      const aPress = Math.round(lengthA / aDist);
      const bPress = Math.round(lengthB / bDist);

      const pressCoord = prize.buttonA.copy().multiply(aPress).add(prize.buttonB.copy().multiply(bPress));
      if (pressCoord.equals(prize.prize)) {
        answer += bPress;
        answer += aPress * 3;
      }
    }
    return answer;
  };

  calculateAnswer1 = (): number => {
    return this.calculateAnswer();
  };

  calculateAnswer2 = (): number => {
    const offset = new Coordinate2d(10000000000000, 10000000000000);
    for (const prize of this.prizes) {
      prize.prize.add(offset);
    }
    return this.calculateAnswer();
  };
}

export const puzzle = new Puzzle('2024', '13', PuzzleStatus.COMPLETE);
