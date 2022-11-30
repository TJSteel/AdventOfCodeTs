import { PuzzleStatus } from '../core/enums';
import { AbstractPuzzle } from '../core/puzzle';

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(5934, 359999, 26984457539, 1631647919273);
  }

  parseInput(): void {
    this.input = this.input[0].split(',');
  }

  calculateAnswer1 = (): number => {
    let currentFish = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.input.forEach((i) => currentFish[i]++);

    for (let day = 0; day < 80; day++) {
      let newFish = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i <= 7; i++) {
        if (i === 0) {
          newFish[6] = currentFish[0];
          newFish[8] = currentFish[0];
        }
        newFish[i] += currentFish[i + 1];
      }
      currentFish = newFish;
    }
    let answer = currentFish.reduce((acc, val) => acc + val, 0);

    return answer;
  };

  calculateAnswer2 = (): number => {
    let currentFish = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.input.forEach((i) => currentFish[i]++);

    for (let day = 0; day < 256; day++) {
      let newFish = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i <= 7; i++) {
        if (i === 0) {
          newFish[6] = currentFish[0];
          newFish[8] = currentFish[0];
        }
        newFish[i] += currentFish[i + 1];
      }
      currentFish = newFish;
    }
    let answer = currentFish.reduce((acc, val) => acc + val, 0);

    return answer;
  };
}

export const puzzle = new Puzzle('2021', '06', PuzzleStatus.COMPLETE);
