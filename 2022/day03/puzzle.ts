import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Rucksack {
  contents: string;
  compartmentA: string;
  compartmentB: string;

  constructor(contents: string) {
    this.contents = contents;
    const length = contents.length;
    this.compartmentA = contents.substring(0, length / 2);
    this.compartmentB = contents.substring(length / 2);
  }

  static getItemPriority(item: string): number {
    const charCode = item.charCodeAt(0);
    if (charCode >= 65 && charCode <= 90) {
      return charCode - 64 + 26;
    } else if (charCode >= 97 && charCode <= 122) {
      return charCode - 96;
    } else {
      throw new Error('Invalid char code');
    }
  }

  getDuplicateItem(): string {
    for (const char of this.compartmentA) {
      if (this.compartmentB.includes(char)) {
        return char;
      }
    }
    throw new Error('No duplicate item found');
  }

  getBadgeId(rucksacks: Rucksack[]) {
    for (const char of this.contents) {
      let isBadge = true;
      for (const rucksack of rucksacks) {
        if (!rucksack.contents.includes(char)) {
          isBadge = false;
          break;
        }
      }
      if (isBadge) {
        return char;
      }
    }
    throw new Error('Badge not found');
  }
}

class Puzzle extends AbstractPuzzle {
  rucksacks: Rucksack[] = [];

  setAnswers(): void {
    super.setAnswers(157, 8072, 70, 2567);
  }

  parseInput(): void {
    this.rucksacks = this.input.map((v) => new Rucksack(v));
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    for (const rucksack of this.rucksacks) {
      const item = rucksack.getDuplicateItem();
      answer += Rucksack.getItemPriority(item);
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    for (let i = 0, len = this.rucksacks.length; i < len; i += 3) {
      const item = this.rucksacks[i].getBadgeId([this.rucksacks[i + 1], this.rucksacks[i + 2]]);
      answer += Rucksack.getItemPriority(item);
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2022', '03', PuzzleStatus.COMPLETE);
