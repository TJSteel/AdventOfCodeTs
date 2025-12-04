import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  map: Array2d<number> = new Array2d();

  setAnswers(): void {
    super.setAnswers(357, 17092, 3121910778619, 170147128753455);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split('').map((v: string) => parseInt(v)));
    this.map = new Array2d({ data: this.input });
  }

  calculateAnswer1 = (): number => {
    let answer = 0;

    for (let row = 0; row < this.map.getHeight(); row++) {
      let firstNum = 0;
      let firstNumIndex = -1;
      let secondNum = 0;
      for (let col = 0; col < this.map.getWidth() - 1; col++) {
        const currentNum = this.map.getCell(new Coordinate2d(col, row))!;
        if (currentNum > firstNum) {
          firstNum = currentNum;
          firstNumIndex = col;
        }
      }
      for (let col = firstNumIndex + 1; col < this.map.getWidth(); col++) {
        const currentNum = this.map.getCell(new Coordinate2d(col, row))!;
        if (currentNum > secondNum) {
          secondNum = currentNum;
        }
      }
      const rowAnswer = firstNum * 10 + secondNum;
      answer += rowAnswer;
    }

    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    let numberLength = 12;

    for (let row = 0; row < this.map.getHeight(); row++) {
      let rowAnswer = '';
      let currentIndex = 0;
      while (rowAnswer.length < numberLength) {
        let endIndex = this.map.getWidth() - (numberLength - rowAnswer.length) + 1;
        let highestNumber = 0;
        for (let col = currentIndex; col < endIndex; col++) {
          const currentNum = this.map.getCell(new Coordinate2d(col, row))!;
          if (currentNum > highestNumber) {
            highestNumber = currentNum;
            currentIndex = col + 1;
          }
        }
        rowAnswer += highestNumber;
      }
      answer += parseInt(rowAnswer);
    }

    return answer;
  };
}

export const puzzle = new Puzzle('2025', '03', PuzzleStatus.COMPLETE);
