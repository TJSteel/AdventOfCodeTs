import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { TjMath } from '../../core/utils/math';

interface DigPlan {
  direction: string;
  distance: number;
  direction2?: string;
  distance2?: number;
}

const directions = {
  U: new Coordinate2d(0, -1),
  D: new Coordinate2d(0, 1),
  L: new Coordinate2d(-1, 0),
  R: new Coordinate2d(1, 0),
};

const getArea = (digPlans: DigPlan[]): number => {
  const startCoord = new Coordinate2d(0, 0);
  let currentCoord = startCoord.copy();
  const coordinates: Coordinate2d[] = [];
  let circumference = 0;

  for (const digPlan of digPlans) {
    const direction: Coordinate2d = directions[digPlan.direction as keyof typeof directions]
      .copy()
      .multiply(digPlan.distance);
    currentCoord = currentCoord.copy().add(direction);
    coordinates.push(currentCoord);
    circumference += startCoord.manhattanDistance(direction);
  }

  const area = TjMath.polygonArea(coordinates);
  return area + circumference / 2 + 1;
};

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(62, 42317, 952408144115, 83605563360288);
  }

  parseInput(): void {
    this.input = this.input.map((i): DigPlan => {
      const parts = i.split(' ');
      const hexCode = parts[2].replace(/[\(\#\)]/g, '');
      const direction2 = 'R.D.L.U'.split('.')[parseInt(hexCode.substring(5))];
      const distance2 = parseInt(hexCode.substring(0, 5), 16);
      return {
        direction: parts[0],
        distance: parseInt(parts[1]),
        direction2,
        distance2,
      };
    });
  }

  calculateAnswer1 = (): number => {
    return getArea(this.input);
  };

  calculateAnswer2 = (): number => {
    return getArea(
      this.input.map((digPlan) => {
        return {
          direction: digPlan.direction2,
          distance: digPlan.distance2,
        };
      })
    );
  };
}

export const puzzle = new Puzzle('2023', '18', PuzzleStatus.COMPLETE);
