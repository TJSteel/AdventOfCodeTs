import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

const startsWith = (pattern: string, towel: string) => {
  for (let i = 0; i < towel.length; i++) {
    if (pattern[i] !== towel[i]) {
      return false;
    }
  }
  return true;
};

const isPossible = (pattern: string, towels: string[], memo: Map<string, boolean>): boolean => {
  if (memo.has(pattern)) {
    return memo.get(pattern)!;
  }

  for (const towel of towels) {
    if (startsWith(pattern, towel)) {
      if (towel.length == pattern.length) {
        memo.set(pattern, true);
        return true;
      } else if (isPossible(pattern.substring(towel.length), towels, memo)) {
        memo.set(pattern, true);
        return true;
      }
    }
  }

  memo.set(pattern, false);
  return false;
};
const allPossibleCount = (pattern: string, towels: string[], memo: Map<string, number>): number => {
  if (memo.has(pattern)) {
    return memo.get(pattern)!;
  }
  let count = 0;

  for (const towel of towels) {
    if (startsWith(pattern, towel)) {
      if (towel.length == pattern.length) {
        count++;
      } else {
        count += allPossibleCount(pattern.substring(towel.length), towels, memo);
      }
    }
  }

  memo.set(pattern, count);
  return count;
};

class Puzzle extends AbstractPuzzle {
  towels: string[] = [];
  patterns: string[] = [];

  setAnswers(): void {
    super.setAnswers(6, 226, 16, 601201576113503);
  }

  parseInput(): void {
    this.towels = this.input[0].split(', ');
    this.patterns = [];
    for (let i = 2; i < this.input.length; i++) {
      this.patterns.push(this.input[i]);
    }
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    for (const pattern of this.patterns) {
      if (isPossible(pattern, this.towels, new Map())) {
        answer++;
      }
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    for (const pattern of this.patterns) {
      answer += allPossibleCount(pattern, this.towels, new Map());
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2024', '19', PuzzleStatus.COMPLETE);
