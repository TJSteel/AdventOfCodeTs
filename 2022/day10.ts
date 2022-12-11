import { PuzzleStatus } from '../core/enums';
import { AbstractPuzzle } from '../core/puzzle';

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    const testAnswer2 = `
##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`;
    const mainAnswer2 = `
###..###..###...##..###...##...##..####.
#..#.#..#.#..#.#..#.#..#.#..#.#..#.#....
#..#.###..#..#.#..#.#..#.#..#.#....###..
###..#..#.###..####.###..####.#.##.#....
#.#..#..#.#....#..#.#.#..#..#.#..#.#....
#..#.###..#....#..#.#..#.#..#..###.#....`;
    super.setAnswers(13140, 12740, testAnswer2, mainAnswer2);
  }

  calculateAnswer1 = (): number => {
    let x = 1;
    let cycle = 1;
    let answer = 0;
    const signals = [];
    const checkCycle = () => {
      if ((cycle + 20) % 40 == 0 && cycle <= 220) {
        const signal = x * cycle;
        signals.push(signal);
        answer += signal;
      }
    };
    for (const input of this.input) {
      if (input == 'noop') {
        cycle++;
        checkCycle();
      } else {
        const value = parseInt(input.split(' ')[1]);
        cycle++;
        checkCycle();
        x += value;
        cycle++;
        checkCycle();
      }
    }

    return answer;
  };

  calculateAnswer2 = (): string => {
    let x = 1;
    let cycle = 0;
    let answer = '';
    const checkCycle = () => {
      if (cycle >= 240) {
        return;
      }
      const pos = cycle % 40;
      if (pos == 0) {
        answer += '\n';
      }
      const xFrom = x - 1;
      const xTo = x + 1;
      const isVisible = pos >= xFrom && pos <= xTo;
      answer += isVisible ? '#' : '.';
    };
    checkCycle();
    for (const input of this.input) {
      if (input == 'noop') {
        cycle++;
        checkCycle();
      } else {
        const value = parseInt(input.split(' ')[1]);
        cycle++;
        checkCycle();
        x += value;
        cycle++;
        checkCycle();
      }
    }

    return answer;
  };
}

export const puzzle = new Puzzle('2022', '10', PuzzleStatus.COMPLETE);
