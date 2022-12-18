import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

enum Order {
  CORRECT,
  INCORRECT,
  SAME,
}

class Pair {
  index: number;
  left: any;
  right: any;
  leftArray: boolean;
  rightArray: boolean;
  constructor(index: number, left: any, right: any) {
    this.index = index;

    this.left = left;
    this.right = right;

    this.leftArray = Array.isArray(left);
    this.rightArray = Array.isArray(right);
  }
}

const pairInOrder = (pair: Pair): Order => {
  if (!pair.leftArray && !pair.rightArray) {
    if (pair.left < pair.right) {
      return Order.CORRECT;
    } else if (pair.left == pair.right) {
      return Order.SAME;
    } else {
      return Order.INCORRECT;
    }
  }

  if (pair.leftArray && pair.rightArray) {
    const leftLen = pair.left?.length ? pair.left.length : 0;
    const rightLen = pair.right?.length ? pair.right.length : 0;
    for (let i = 0, len = Math.max(leftLen, rightLen); i < len; i++) {
      if (i >= leftLen) {
        return Order.CORRECT;
      } else if (i >= rightLen) {
        return Order.INCORRECT;
      } else {
        const nextOrder = pairInOrder(new Pair(pair.index, pair.left[i], pair.right[i]));
        if (nextOrder == Order.SAME) {
          continue;
        }
        return nextOrder;
      }
    }
    return Order.SAME;
  }

  if (pair.rightArray) {
    return pairInOrder(new Pair(pair.index, [pair.left], pair.right));
  }
  return pairInOrder(new Pair(pair.index, pair.left, [pair.right]));
};

class Puzzle extends AbstractPuzzle {
  pairs: Pair[] = [];
  pairStrings: string[] = [];
  setAnswers(): void {
    super.setAnswers(13, 5196, 140, 22134);
  }

  parseInput(): void {
    this.pairs = [];
    this.input = this.input.filter((v) => v);
    this.pairStrings = this.input;

    this.input = this.input.map((v) => JSON.parse(v));
    let index = 1;
    for (let i = 0, len = this.input.length; i < len; i += 2) {
      this.pairs.push(new Pair(index++, this.input[i], this.input[i + 1]));
    }
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    this.pairs.forEach((pair) => {
      if (pairInOrder(pair) == Order.CORRECT) {
        answer += pair.index;
      }
    });
    return answer;
  };

  calculateAnswer2 = (): number => {
    const divider1 = '[[2]]';
    const divider2 = '[[6]]';
    this.pairStrings.push(divider1);
    this.pairStrings.push(divider2);

    this.pairStrings.sort((a, b) => {
      const pair = new Pair(0, JSON.parse(a), JSON.parse(b));
      const order = pairInOrder(pair);
      if (order == Order.CORRECT) {
        return -1;
      } else if (order == Order.INCORRECT) {
        return 1;
      } else {
        return 0;
      }
    });
    const divider1Index = this.pairStrings.findIndex((v) => v == divider1) + 1;
    const divider2Index = this.pairStrings.findIndex((v) => v == divider2) + 1;
    return divider1Index * divider2Index;
  };
}

export const puzzle = new Puzzle('2022', '13', PuzzleStatus.COMPLETE);
