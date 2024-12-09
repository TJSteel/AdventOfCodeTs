import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  numbers: number[] = [];
  setAnswers(): void {
    super.setAnswers(1928, 6401092019345, 2858, 6431472344710);
  }

  parseInput(): void {
    this.numbers = this.input[0].split('').map(Number);
    const numbers: number[] = [];
    let isBlock = true;
    let index = 0;
    for (const num of this.numbers) {
      if (isBlock) {
        for (let i = 0; i < num; i++) {
          numbers.push(index);
        }
        index++;
      } else {
        for (let i = 0; i < num; i++) {
          numbers.push(-1);
        }
      }
      isBlock = !isBlock;
    }
    this.numbers = numbers;
  }

  calculateAnswer1 = (): number => {
    let dotIndex = this.numbers.indexOf(-1);
    while (this.numbers.indexOf(-1) > -1) {
      if (this.numbers[this.numbers.length - 1] !== -1) {
        this.numbers[dotIndex] = this.numbers[this.numbers.length - 1];
      }
      this.numbers.pop();
      dotIndex = this.numbers.indexOf(-1);
    }

    let answer = 0;

    for (let i = 1; i < this.numbers.length; i++) {
      answer += i * this.numbers[i];
    }

    return answer;
  };

  calculateAnswer2 = (): number => {
    for (let blockStartIndex = this.numbers.length - 1; blockStartIndex > 0; blockStartIndex--) {
      let blockLength = 1;
      let blockId = this.numbers[blockStartIndex];
      if (blockId === -1) {
        continue;
      }
      while (this.numbers[blockStartIndex - 1] == blockId) {
        blockStartIndex--;
        blockLength++;
      }

      let freeIndex = 0;
      let freeLength = 0;
      while (freeIndex < blockStartIndex && freeLength < blockLength) {
        if (this.numbers[freeIndex + freeLength] == -1) {
          freeLength++;
        } else {
          freeIndex += freeLength > 0 ? freeLength : 1;
          freeLength = 0;
        }
      }

      if (freeLength == blockLength) {
        while (blockLength-- > 0) {
          this.numbers[freeIndex++] = blockId;
          this.numbers[blockStartIndex++] = -1;
        }
      }
    }

    let answer = 0;

    for (let i = 0; i < this.numbers.length; i++) {
      if (this.numbers[i] == -1) {
        continue;
      }
      answer += i * this.numbers[i];
    }

    return answer;
  };
}

export const puzzle = new Puzzle('2024', '09', PuzzleStatus.COMPLETE);
