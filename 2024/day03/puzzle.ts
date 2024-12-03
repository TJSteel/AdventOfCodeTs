import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  fullString!: string;
  setAnswers(): void {
    super.setAnswers(161, 159833790, 48, 89349241);
  }

  parseInput(): void {
    this.fullString = this.input.join('');
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    const search = this.fullString.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g);
    for (const result of search) {
      const sum = result.splice(1, 2).map(Number);
      answer += sum[0] * sum[1];
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    let enabled = true;
    const search = this.fullString.matchAll(/mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)/g);
    for (const result of search) {
      switch (result[0]) {
        case 'do()':
          enabled = true;
          break;
        case "don't()":
          enabled = false;
          break;
        default:
          if (enabled) {
            const sum = result.splice(1, 2).map(Number);
            answer += sum[0] * sum[1];
          }
      }
    }

    return answer;
  };
}

export const puzzle = new Puzzle('2024', '03', PuzzleStatus.COMPLETE);
