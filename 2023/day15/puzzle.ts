import { PuzzleStatus } from '../../core/enums';

import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(1320, 510388, 0, 0);
  }

  parseInput(): void {
    this.input = this.input[0].split(',');
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    this.input.forEach((str: string, i: number) => {
      let value = 0;
      for (const char of str) {
        const charCode = char.charCodeAt(0);
        value += charCode;
        value *= 17;
        value %= 256;
      }
      answer += value;
    });
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;

    return answer;
  };
}

export const puzzle = new Puzzle('2023', '15', PuzzleStatus.IN_PROGRESS);
