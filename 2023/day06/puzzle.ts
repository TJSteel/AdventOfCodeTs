import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

// brute force part 2 was 200ms
// end to end search 60ms

const getFirstWin = (bestDistance: number, totalTime: number): number => {
  for (let time = 1; time < totalTime; time++) {
    const distance = getDistance(totalTime, time);
    if (distance > bestDistance) {
      return time;
    }
  }
  return 0;
};

const getLastWin = (bestDistance: number, totalTime: number): number => {
  for (let time = totalTime - 1; time > 0; time--) {
    const distance = getDistance(totalTime, time);
    if (distance > bestDistance) {
      return time;
    }
  }
  return 0;
};
const getDistance = (totalTime: number, holdTime: number): number => holdTime * (totalTime - holdTime);

const getWinCount = (bestDistance: number, totalTime: number): number => {
  const firstWin = getFirstWin(bestDistance, totalTime);
  const lastWin = getLastWin(bestDistance, totalTime);
  return lastWin - firstWin + 1;
};

class Puzzle extends AbstractPuzzle {
  times: number[] = [];
  distances: number[] = [];

  setAnswers(): void {
    super.setAnswers(288, 1195150, 71503, 42550411);
  }

  parseInput(): void {
    this.input = this.input.map((i) =>
      i
        .split(':')[1]
        .split(' ')
        .filter((v: string) => v)
        .map((v: string) => parseInt(v))
    );
    this.times = this.input[0];
    this.distances = this.input[1];
  }

  calculateAnswer1 = (): number => {
    const wins: number[] = [];
    for (let i = 0, len = this.times.length; i < len; i++) {
      const bestDistance = this.distances[i];
      const totalTime = this.times[i];

      wins.push(getWinCount(bestDistance, totalTime));
    }

    return wins.reduce((a, b) => a * b, 1);
  };

  calculateAnswer2 = (): number => {
    const bestDistance = parseInt(this.distances.reduce((a, b) => a + b, ''));
    const totalTime = parseInt(this.times.reduce((a, b) => a + b, ''));
    return getWinCount(bestDistance, totalTime);
  };
}

export const puzzle = new Puzzle('2023', '06', PuzzleStatus.COMPLETE);
