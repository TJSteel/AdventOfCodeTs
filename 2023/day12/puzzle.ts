import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { TjMath } from '../../core/utils/math';
import { StringUtils } from '../../core/utils/stringUtils';

// this puzzle is essentially a single line nonogram

/**
 * This validates if the pattern is valid or possible
 * @param pattern string containing .?#
 * @param numbers number[] of lengths to fit the pattern
 * @returns
 */
const isValidPattern = (pattern: string, numbers: number[]): boolean => {
  let regex: string = `^[^#]*`;
  const last = numbers.length - 1;
  for (let i = 0; i <= last; i++) {
    regex += `[#?]{${numbers[i]}}`;
    if (i != last) {
      regex += `[^#]`; // not directly followed by a #
      regex += `[.?]*`; // then containing no # until the next match
    }
  }
  regex += `[^#]*$`; // no # after match
  return pattern.search(new RegExp(regex)) != -1;
};

const getValidSolutionCount = (pattern: string, numbers: number[], memo: Map<string, number>): number => {
  const memoKey = `${pattern}:${numbers}`;
  if (memo.has(memoKey)) {
    return memo.get(memoKey)!;
  }
  if (numbers.length == 0) {
    const value = pattern.indexOf('#') == -1 ? 1 : 0;
    memo.set(memoKey, value);
    return value;
  }
  const minLength = numbers.reduce((a, b) => a + b, 0) + numbers.length - 1;
  if (pattern.length < minLength) {
    memo.set(memoKey, 0);
    return 0;
  } else if (pattern.length == minLength) {
    let value = isValidPattern(pattern, numbers) ? 1 : 0;
    memo.set(memoKey, value);
    return value;
  }

  let count = 0;
  if (pattern[0] == '#') {
    if (pattern.search(new RegExp(`^[#?]{${numbers[0]}}[^#]`)) == -1) {
      memo.set(memoKey, 0);
      return 0;
    }
    const newPattern = pattern.substring(numbers[0] + 1);
    const newNumbers: number[] = numbers.slice(1);
    count += getValidSolutionCount(newPattern, newNumbers, memo);
  } else if (pattern[0] == '?') {
    count += getValidSolutionCount('#' + pattern.substring(1), numbers, memo);
    count += getValidSolutionCount('.' + pattern.substring(1), numbers, memo);
  } else {
    count += getValidSolutionCount(pattern.substring(1), numbers, memo);
  }
  memo.set(memoKey, count);
  return count;
};

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(21, 7843, 525152, 10153896718999);
  }

  parseInput(): void {
    this.input = this.input.map((v) => {
      const parts = v.split(' ');
      return {
        pattern: parts[0],
        numbers: parts[1].split(',').map((i: string) => parseInt(i)),
      };
    });
  }

  calculateAnswer1 = (): number => {
    const solutions: number[] = [];
    const memo = new Map();
    this.input.forEach((v) => {
      const { pattern, numbers } = v;
      const solution = getValidSolutionCount(StringUtils.trim(pattern, '.'), numbers, memo);
      solutions.push(solution);
    });
    return TjMath.sum(solutions);
  };

  calculateAnswer2 = (): number => {
    let answer: number = 0;
    this.input.forEach((v) => {
      v.pattern = `${v.pattern}?${v.pattern}?${v.pattern}?${v.pattern}?${v.pattern}`;
      v.numbers = [...v.numbers, ...v.numbers, ...v.numbers, ...v.numbers, ...v.numbers];
    });
    const memo = new Map();
    this.input.forEach((v) => {
      const { pattern, numbers } = v;
      answer += getValidSolutionCount(StringUtils.trim(pattern, '.'), numbers, memo);
    });
    return answer;
  };
}

export const puzzle = new Puzzle('2023', '12', PuzzleStatus.COMPLETE);
