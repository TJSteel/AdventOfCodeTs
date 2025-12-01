import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(3, 1071, 6, 6700, { lowAnswers: { main2: [6671] }, highAnswers: { main2: [7114] } });
  }

  parseInput(): void {
    this.input = this.input.map((line) => {
      let direction = line.charAt(0);
      let distance = parseInt(line.substring(1));
      return direction === 'R' ? distance : distance * -1;
    });
  }

  calculateAnswer1 = (): number => {
    let answer = 0;

    let location = 50;
    for (const distance of this.input) {
      location += distance;
      location %= 100;

      if (location === 0) {
        answer++;
      }
    }

    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;

    let location = 50;
    for (let distance of this.input) {
      const increment = distance > 0 ? 1 : -1;

      while (distance !== 0) {
        location += increment;
        distance -= increment;

        if (location < 0) {
          location += 100;
        }
        if (location > 99) {
          location -= 100;
        }
        if (location == 0) {
          answer++;
        }
      }
    }

    return answer;
  };
}

export const puzzle = new Puzzle('2025', '01', PuzzleStatus.COMPLETE);
