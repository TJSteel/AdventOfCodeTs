import { PuzzleStatus } from '../../core/enums';

import { AbstractPuzzle } from '../../core/puzzle';

const getHashValue = (str: string): number => {
  let value = 0;
  for (const char of str) {
    const charCode = char.charCodeAt(0);
    value += charCode;
    value *= 17;
    value %= 256;
  }
  return value;
};

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(1320, 510388, 145, 291774);
  }

  parseInput(): void {
    this.input = this.input[0].split(',');
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    for (const str of this.input) {
      answer += getHashValue(str);
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    const boxes: Array<{ label: string; focalLength: string }[]> = [];
    this.input.forEach((str: string) => {
      const operation = str.includes('-') ? '-' : '=';
      const [label, focalLength] = str.replace(operation, ' ').split(' ');
      const lens = { label, focalLength };
      const boxNumber = getHashValue(label);

      if (!boxes[boxNumber]) {
        boxes[boxNumber] = [];
      }
      const box = boxes[boxNumber];
      if (operation == '-') {
        const index = box.findIndex((l) => l.label == label);
        if (index != -1) {
          box.splice(index, 1);
        }
      } else {
        const existingLens = box.find((l) => l.label == label);
        if (existingLens) {
          existingLens.focalLength = lens.focalLength;
        } else {
          box.push(lens);
        }
      }
    });
    boxes.forEach((lenses, boxIndex) => {
      if (lenses.length == 0) {
        return;
      }

      lenses.forEach((lens, index) => {
        answer += (boxIndex + 1) * (index + 1) * parseInt(lens.focalLength);
      });
    });
    return answer;
  };
}

export const puzzle = new Puzzle('2023', '15', PuzzleStatus.COMPLETE);
