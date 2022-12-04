import { PuzzleStatus } from '../core/enums';
import { AbstractPuzzle } from '../core/puzzle';

interface Elf {
  start: number;
  end: number;
}

class ElfPair {
  static _hasFullOverlap(elf1: Elf, elf2: Elf) {
    return elf1.start >= elf2.start && elf1.end <= elf2.end;
  }
  hasFullOverlap(): boolean {
    return ElfPair._hasFullOverlap(this.elf1, this.elf2) || ElfPair._hasFullOverlap(this.elf2, this.elf1);
  }
  static _hasOverlap(elf1: Elf, elf2: Elf) {
    return elf1.start <= elf2.end && elf1.end >= elf2.end;
  }
  hasOverlap(): boolean {
    return ElfPair._hasOverlap(this.elf1, this.elf2) || ElfPair._hasOverlap(this.elf2, this.elf1);
  }
  elf1: Elf;
  elf2: Elf;
  constructor(elf1: Elf, elf2: Elf) {
    this.elf1 = elf1;
    this.elf2 = elf2;
  }
}

class Puzzle extends AbstractPuzzle {
  elfPairs: ElfPair[] = [];
  setAnswers(): void {
    super.setAnswers(2, 464, 4, 0);
  }

  parseInput(): void {
    this.elfPairs = [];
    this.input = this.input.map((i) => i.split(','));

    for (let elfPair of this.input) {
      const elf1numbers = elfPair[0].split('-').map((v: string) => parseInt(v));
      const elf2numbers = elfPair[1].split('-').map((v: string) => parseInt(v));
      const elf1 = { start: elf1numbers[0], end: elf1numbers[1] };
      const elf2 = { start: elf2numbers[0], end: elf2numbers[1] };

      this.elfPairs.push(new ElfPair(elf1, elf2));
    }
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    for (const pair of this.elfPairs) {
      if (pair.hasFullOverlap()) {
        answer++;
      }
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    for (const pair of this.elfPairs) {
      if (pair.hasOverlap()) {
        answer++;
      }
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2022', '04', PuzzleStatus.COMPLETE);
