import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
const getCenterValue = (update: number[]): number => {
  return update[Math.floor(update.length / 2)];
};
class Puzzle extends AbstractPuzzle {
  rules: Array<number[]> = [];
  updates: Array<number[]> = [];

  isUpdateValid(update: number[]): boolean {
    for (const rule of this.rules) {
      const i1 = update.indexOf(rule[0]);
      const i2 = update.indexOf(rule[1]);
      if (i1 == -1 || i2 == -1) {
        continue;
      }
      if (i1 > i2) {
        return false;
      }
    }
    return true;
  }

  setAnswers(): void {
    super.setAnswers(143, 4578, 123, 6179);
  }

  parseInput(): void {
    this.rules = [];
    this.updates = [];
    for (const line of this.input) {
      if (line.includes('|')) {
        this.rules.push(line.split('|').map(Number));
      } else if (line.includes(',')) {
        this.updates.push(line.split(',').map(Number));
      }
    }
  }

  calculateAnswer1 = (): number => {
    let answer = 0;

    for (const update of this.updates) {
      if (this.isUpdateValid(update)) {
        answer += getCenterValue(update);
      }
    }

    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;

    for (const update of this.updates) {
      if (!this.isUpdateValid(update)) {
        update.sort((a: number, b: number) => {
          for (const rule of this.rules) {
            const r1 = rule[0];
            const r2 = rule[1];
            if ((a !== r1 && a !== r2) || (b !== r1 && b !== r2)) {
              continue;
            }
            if (a == r1) {
              return -1;
            } else {
              return 1;
            }
          }
          return 0;
        });

        answer += getCenterValue(update);
      }
    }

    return answer;
  };
}

export const puzzle = new Puzzle('2024', '05', PuzzleStatus.COMPLETE);
