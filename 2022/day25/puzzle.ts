import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { Snafu } from './snafu';

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers('2=-1=0', '2-==10--=-0101==1201', 0, 0);
  }

  calculateAnswer1 = (): string => {
    // Snafu.tests();

    const decimal = this.input
      .map((v) => Snafu.snafuToDecimal(v))
      .reduce((acc: number, value: number) => acc + value, 0);

    const snafu = Snafu.decimalToSnafu(decimal);

    return snafu;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;

    return answer;
  };
}

export const puzzle = new Puzzle('2022', '25', PuzzleStatus.COMPLETE);
