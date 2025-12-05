import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  ranges: Array<{ min: number; max: number }> = [];
  ingredientIds: number[] = [];

  setAnswers(): void {
    super.setAnswers(3, 681, 14, 348820208020395, {
      highAnswers: { main1: [684] },
      lowAnswers: { main2: [327039828473999] },
    });
  }

  parseInput(): void {
    this.ranges = [];
    this.ingredientIds = [];
    let i = 0;
    while (i < this.input.length) {
      if (this.input[i] === '') {
        i++;
        break;
      }
      const [min, max] = this.input[i].split('-').map((n: string) => parseInt(n));
      this.ranges.push({ min, max });
      i++;
    }
    while (i < this.input.length) {
      this.ingredientIds.push(parseInt(this.input[i]));
      i++;
    }
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    for (const id of this.ingredientIds) {
      for (const range of this.ranges) {
        if (id >= range.min && id <= range.max) {
          answer++;
          break;
        }
      }
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    this.ranges.sort((a, b) => a.min - b.min);
    let i = this.ranges[0].min;
    for (const range of this.ranges) {
      if (i < range.min) {
        i = range.min;
      }
      if (i > range.max) {
        continue;
      }
      answer += range.max - i + 1;
      i = range.max + 1;
    }

    return answer;
  };
}

export const puzzle = new Puzzle('2025', '05', PuzzleStatus.COMPLETE);
