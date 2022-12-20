import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { Item } from './interfaces';

class Puzzle extends AbstractPuzzle {
  items: Item[] = [];
  len: number = 0;
  maxMove: number = 0;

  setAnswers(): void {
    super.setAnswers(3, 9866, 1623178306, 12374299815791);
  }

  parseInput(): void {
    this.items = [];
    this.input
      .map((i) => parseInt(i))
      .forEach((value: number, i: number) => {
        this.items.push({ initialIndex: i, currentIndex: i, value, moveValue: value });
      });
    this.len = this.items.length;
    this.maxMove = this.len - 1; // you can't move the full length because the final item would have moved forwards as you passed it
  }

  applyDecryptionValue(decryptionKey: number) {
    for (const item of this.items) {
      item.value *= decryptionKey;
      item.moveValue = item.value;
      item.moveValue %= this.maxMove;
      if (item.moveValue <= 0) {
        item.moveValue += this.maxMove;
      }
    }
  }

  moveItems(items: Item[]): Item[] {
    for (let i = 0; i < this.len; i++) {
      const item = this.items[i];
      let newIndex = item.currentIndex + item.moveValue;
      newIndex %= this.maxMove;
      if (newIndex <= 0) {
        newIndex += this.maxMove;
      }

      let moveDistance = newIndex - item.currentIndex;

      const direction = moveDistance >= 0 ? 1 : -1;

      while (moveDistance != 0) {
        moveDistance -= direction;
        item.currentIndex += direction;
        const nextItem = items[item.currentIndex];
        nextItem.currentIndex -= direction;
      }
      items.sort((a, b) => a.currentIndex - b.currentIndex);
    }

    return items;
  }

  calculateAnswer(items: Item[]) {
    const zero = items.findIndex((v) => v.value == 0);

    return (
      items[(1000 + zero) % this.len].value +
      items[(2000 + zero) % this.len].value +
      items[(3000 + zero) % this.len].value
    );
  }

  calculateAnswer1 = (): number => {
    this.applyDecryptionValue(1);
    let sorted = this.moveItems([...this.items]);
    return this.calculateAnswer(sorted);
  };

  calculateAnswer2 = (): number => {
    this.applyDecryptionValue(811589153);
    let sorted = [...this.items];

    for (let turns = 0; turns < 10; turns++) {
      sorted = this.moveItems(sorted);
    }

    return this.calculateAnswer(sorted);
  };
}

export const puzzle = new Puzzle('2022', '20', PuzzleStatus.COMPLETE);
