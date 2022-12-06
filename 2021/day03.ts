import { PuzzleStatus } from '../core/enums';
import { AbstractPuzzle } from '../core/puzzle';

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(198, 3148794, 230, 2795310);
  }

  calculateAnswer1 = (): number => {
    let counts: number[] = [];
    let arrLenDiv2 = this.input.length / 2;
    let numLen = this.input[0].length;

    for (let value of this.input) {
      for (let i = 0; i < numLen; i++) {
        counts[i] = counts[i] ? counts[i] + parseInt(value[i]) : parseInt(value[i]);
      }
    }
    let gammaBinary = '';
    let epsilonBinary = '';

    for (let count of counts) {
      if (count > arrLenDiv2) {
        gammaBinary += 1;
        epsilonBinary += 0;
      } else {
        gammaBinary += 0;
        epsilonBinary += 1;
      }
    }

    let gamma = parseInt(gammaBinary, 2);
    let epsilon = parseInt(epsilonBinary, 2);

    return gamma * epsilon;
  };

  calculateAnswer2 = (): number => {
    let numLen = this.input[0].length;
    let oxygenStr = [...this.input];
    for (let i = 0; i < numLen; i++) {
      let count = 0;
      for (let value of oxygenStr) {
        count += parseInt(value[i]);
      }
      let common = count >= oxygenStr.length / 2 ? 1 : 0;
      oxygenStr = oxygenStr.filter((val) => val[i] == common);
      if (oxygenStr.length === 1) {
        break;
      }
    }
    let oxygen = parseInt(oxygenStr[0], 2);

    let c02Str = [...this.input];
    for (let i = 0; i < numLen; i++) {
      let count = 0;
      for (let value of c02Str) {
        count += parseInt(value[i]);
      }
      let common = count >= c02Str.length / 2 ? 0 : 1;
      c02Str = c02Str.filter((val) => val[i] == common);
      if (c02Str.length === 1) {
        break;
      }
    }
    let c02 = parseInt(c02Str[0], 2);

    return oxygen * c02;
  };
}

export const puzzle = new Puzzle('2021', '03', PuzzleStatus.COMPLETE);
