import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

let winValue = {
  0: 0,
  1: 1,
  2: 2,
  3: 4,
  4: 8,
  5: 16,
  6: 32,
  7: 64,
  8: 128,
  9: 256,
  10: 512,
};

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(13, 24542, 30, 8736438);
  }

  parseInput(): void {
    this.input = this.input.map((i) => {
      let parts = i.split(': ')[1].split(' | ');
      let winningNumbers = parts[0].split(' ').map((v: string) => parseInt(v));
      let yourNumbers = parts[1]
        .split(' ')
        .map((v: string) => parseInt(v))
        .filter((n: number) => !isNaN(n));
      return { count: 1, winningNumbers, yourNumbers };
    });
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    for (const card of this.input) {
      let matches = 0;
      for (let number of card.yourNumbers) {
        if (card.winningNumbers.includes(number)) {
          matches++;
        }
      }
      answer += winValue[matches as keyof typeof winValue];
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    for (let i = 0, len = this.input.length; i < len; i++) {
      const card = this.input[i];
      let matches = 0;
      for (let number of card.yourNumbers) {
        if (card.winningNumbers.includes(number)) {
          matches++;
        }
      }
      while (matches > 0) {
        this.input[i + matches--].count += card.count;
      }
      answer += card.count;
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2023', '04', PuzzleStatus.COMPLETE);
