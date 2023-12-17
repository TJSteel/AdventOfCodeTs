import { Array2d } from '../../core/array2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  map: Array2d<number> = new Array2d();

  setAnswers(): void {
    super.setAnswers(0, 0, 0, 0);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split('').map((v: string) => parseInt(v)));
    this.map = new Array2d({ data: this.input });
  }

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
