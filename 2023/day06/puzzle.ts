import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

// brute force part 2 was 200ms
// end to end search 60ms
// binary search 0.4ms

const getFirstWin = (bestDistance: number, totalTime: number, minTime: number, maxTime: number): number => {
  if (minTime == maxTime) {
    return minTime;
  }

  const midTime = Math.floor((minTime + maxTime) / 2);
  const midWin: boolean = getDistance(totalTime, midTime) > bestDistance;

  if (midWin) {
    return getFirstWin(bestDistance, totalTime, minTime, midTime);
  } else {
    return getFirstWin(bestDistance, totalTime, midTime + 1, maxTime);
  }
};

const getLastWin = (bestDistance: number, totalTime: number, minTime: number, maxTime: number): number => {
  if (minTime == maxTime) {
    return minTime;
  }

  const midTime = Math.ceil((minTime + maxTime) / 2);
  const midWin: boolean = getDistance(totalTime, midTime) > bestDistance;

  if (midWin) {
    return getLastWin(bestDistance, totalTime, midTime, maxTime);
  } else {
    return getLastWin(bestDistance, totalTime, minTime, midTime - 1);
  }
};
const getDistance = (totalTime: number, holdTime: number): number => holdTime * (totalTime - holdTime);

const getWinCount = (bestDistance: number, totalTime: number): number => {
  const firstWin = getFirstWin(bestDistance, totalTime, 1, totalTime - 1);
  const lastWin = getLastWin(bestDistance, totalTime, 1, totalTime - 1);
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
    let answer = 1;

    for (let i = 0, len = this.times.length; i < len; i++) {
      const bestDistance = this.distances[i];
      const totalTime = this.times[i];
      answer *= getWinCount(bestDistance, totalTime);
    }

    return answer;
  };

  calculateAnswer2 = (): number => {
    const bestDistance = parseInt(this.distances.reduce((a, b) => a + b, ''));
    const totalTime = parseInt(this.times.reduce((a, b) => a + b, ''));
    return getWinCount(bestDistance, totalTime);
  };
}

export const puzzle = new Puzzle('2023', '06', PuzzleStatus.COMPLETE);
