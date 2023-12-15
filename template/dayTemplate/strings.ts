import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(0, 0, 0, 0);
  }

  parseInput(): void {}

  calculateAnswer1 = (): number => {
    let answer = 0;

    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;

    return answer;
  };
}

export const puzzle = new Puzzle('Year', 'Day', PuzzleStatus.IN_PROGRESS);
