import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { tjMath } from '../../core/utils';

// this puzzle is essentially a single line nonogram
interface Clue {
  min: number;
  max: number;
  length: number;
  solved: boolean;
  possibleLocations: { min: number; max: number }[];
}

const isValidPattern = (pattern: string, numbers: number[]): boolean => {
  const parts = pattern.split('.').filter((v) => v);
  const length = parts.length;
  if (length != numbers.length) {
    return false;
  }
  for (let i = 0; i < length; i++) {
    if (parts[i].length != numbers[i]) {
      return false;
    }
  }

  return true;
};

const getPermutations = (pattern: string) => {
  if (pattern.length < 2) return pattern; // This is our break condition

  const permutations: string[] = []; // This array will hold our permutations
  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];

    // Cause we don't want any duplicates:
    if (pattern.indexOf(char) != i)
      // if char was used already
      continue; // skip it this time

    const remainingString = pattern.slice(0, i) + pattern.slice(i + 1, pattern.length); //Note: you can concat Strings via '+' in JS

    for (const subPermutation of getPermutations(remainingString)) {
      permutations.push(char + subPermutation);
    }
  }
  return permutations;
};

const compressPattern = (pattern: string): string => {
  while (pattern[0] == '.') {
    pattern = pattern.substring(1);
  }
  while (pattern[pattern.length - 1] == '.') {
    pattern = pattern.substring(0, pattern.length - 1);
  }
  while (pattern.includes('..')) {
    pattern = pattern.replace('..', '.');
  }
  return pattern;
};

const getClues = (pattern: string, numbers: number[]): Clue[] => {
  const clues: Clue[] = numbers.map((v) => {
    return {
      min: 0,
      max: pattern.length - 1,
      length: v,
      solved: false,
      possibleLocations: [],
    };
  });

  return clues;
};

const updateCluesRange = (clues: Clue[], pattern: string[]): boolean => {
  let changed = false;
  changed = updateCluesMin(clues, pattern) || changed;
  changed = updateCluesMax(clues, pattern) || changed;
  return changed;
};

const updateCluesMin = (clues: Clue[], pattern: string[]): boolean => {
  let changed = false;
  for (let i = 1; i < clues.length; i++) {
    const clue: Clue = clues[i];
    const before = clues[i - 1];
    const min = before.min + before.length + 1;
    if (min > clue.min) {
      clue.min = min;
      changed = true;
    }
  }
  return changed;
};

const updateCluesMax = (clues: Clue[], pattern: string[]): boolean => {
  let changed = false;
  for (let i = clues.length - 2; i >= 0; i--) {
    const clue: Clue = clues[i];
    const after = clues[i + 1];
    const max = after.max - after.length - 1;
    if (max < clue.max) {
      clue.max = max;
      changed = true;
    }
  }
  return changed;
};

const updateClueRange = (clue: Clue, pattern: string[]): boolean => {
  let changed = false;
  // remove any ranges the clue can't possibly fit
  // first check all cells left of it's range
  for (let from = clue.min + clue.length - 1; from >= clue.min; from--) {
    if (pattern[from] == '.') {
      from++;
      clue.min = from;
      changed = true;
    }
  }

  // next check all cells right of it's range
  for (let to = clue.max - clue.length + 1; to <= clue.max; to++) {
    if (pattern[to] == '.') {
      to--;
      clue.max = to;
      changed = true;
    }
  }
  return changed;
};

const fillOverlappingClueCells = (clue: Clue, pattern: string[]): boolean => {
  let changed = false;
  const area = clue.max - clue.min + 1;
  // if clue will overlap fill known #'s
  if (area / 2 < clue.length) {
    const padding = area - clue.length;
    for (let j = clue.min + padding; j <= clue.max - padding; j++) {
      if (pattern[j] != '#') {
        pattern[j] = '#';
        changed = true;
      }
    }
  }
  if (area == clue.length) {
    clue.solved = true;
    // make sure there are .'s before and after
    // only if in bounds
    if (clue.min > 0) {
      let index = clue.min - 1;
      if (pattern[index] != '.') {
        pattern[index] = '.';
        changed = true;
      }
    }
    // only if in bounds
    if (clue.max < pattern.length - 1) {
      let index = clue.max + 1;
      if (pattern[index] != '.') {
        pattern[index] = '.';
        changed = true;
      }
    }
  }
  return changed;
};

const fillSidesOfClue = (clue: Clue, before: Clue, after: Clue, pattern: string[]): boolean => {
  let changed = false;
  let from = clue.min;
  if (before?.max >= from) {
    from = before.max + 1;
  }
  let to = clue.max;
  if (after?.min <= to) {
    to = after.min - 1;
  }

  // #s between from / to are ours

  // loop from the left
  let on = false;
  for (let i = 0; i < clue.length; i++) {
    let index = i + clue.min;
    if (index < from) {
      continue;
    }
    if (!on && pattern[index] == '#') {
      on = true;
      const max = index + clue.length - 1;
      if (max < clue.max) {
        clue.max = max;
        changed = true;
      }
    }
    if (on && pattern[index] == '?') {
      pattern[index] = '#';
      changed = true;
    }
  }

  // loop from the right
  on = false;
  for (let i = 0; i < clue.length; i++) {
    let index = clue.max - i;
    if (index > to) {
      continue;
    }
    if (!on && pattern[index] == '#') {
      on = true;
      const min = index - clue.length + 1;
      if (min > clue.min) {
        clue.min = min;
        changed = true;
      }
    }
    if (on && pattern[index] == '?') {
      pattern[index] = '#';
      changed = true;
    }
  }

  return changed;
};

const solveMaxLengthClues = (clues: Clue[], pattern: string[]): boolean => {
  let changed = false;
  const patternString = pattern.join('');
  const sizes: { length: number; count: number }[] = [];
  for (const clue of clues) {
    let len = sizes.find((v) => v.length == clue.length);
    if (!len) {
      len = { length: clue.length, count: 1 };
      sizes.push(len);
    } else {
      len.count++;
    }
  }
  sizes.sort((a, b) => b.length - a.length);
  const size = sizes[0];
  const { length, count } = size;
  let patternGroups = pattern
    .join('')
    .split('?')
    .join('.')
    .split('.')
    .filter((v) => v.length === length);
  if (patternGroups.length === count) {
    // we know where all of the clues of size 3 are
    let nextIndex = -1;
    const solveString = '#'.repeat(length);
    for (const clue of clues.filter((c) => c.length == length)) {
      nextIndex = patternString.indexOf(solveString, nextIndex + 1);
      if (clue.min != nextIndex) {
        clue.min = nextIndex;
        changed = true;
      }
      if (clue.max != nextIndex + length - 1) {
        clue.max = nextIndex + length - 1;
        changed = true;
      }
      clue.solved = true;
    }
  }

  return changed;
};

const updateOutOfBoundsPattern = (clues: Clue[], pattern: string[]): void => {
  for (let i = 0; i < pattern.length; i++) {
    if (!clues.find((c) => i >= c.min && i <= c.max)) {
      pattern[i] = '.';
    }
  }
};

const getSolveClues = (pattern: string, numbers: number[]): { pattern: string; clueGroups: Array<Clue[]> } => {
  pattern = compressPattern(pattern);
  const patternArr = pattern.split('');

  const clues: Clue[] = getClues(pattern, numbers);

  let changed = true;
  while (changed) {
    changed = false;
    changed = updateCluesRange(clues, patternArr) || changed;

    for (let i = 0; i < clues.length; i++) {
      const clue: Clue = clues[i];

      changed = updateClueRange(clue, patternArr) || changed;
      changed = fillOverlappingClueCells(clue, patternArr) || changed;
      changed = fillSidesOfClue(clue, clues[i - 1], clues[i + 1], patternArr) || changed;
    }
    changed = solveMaxLengthClues(clues, patternArr) || changed;
    updateOutOfBoundsPattern(clues, patternArr);
    pattern = patternArr.join('');
  }

  // at this point all solvable locations have been filled so we don't need to scan these
  // instead we can find all possible sub permutations either side of the solved locations
  // once we know this we can return the product of all sub locations

  // for each clue add all possible ranges (there may be . in the middle of it's range)
  for (const clue of clues) {
    for (let min = clue.min, max = clue.min + clue.length - 1; min <= clue.max - clue.length + 1; min++, max++) {
      if (!pattern.substring(min, max + 1).includes('.')) {
        clue.possibleLocations.push({
          min: min,
          max: min + clue.length - 1,
        });
      }
    }
  }

  const clueGroups: Array<Clue[]> = [];
  let currentGroup: Clue[] = [];
  for (let i = 0; i < clues.length; i++) {
    const clue = clues[i];
    const previousClue = currentGroup.length > 0 ? currentGroup[currentGroup.length - 1] : undefined;
    if (!previousClue) {
      currentGroup = [clue];
      continue;
    } else {
      if (previousClue.max >= clue.min - 1) {
        currentGroup.push(clue);
      } else {
        clueGroups.push(currentGroup);
        currentGroup = [clue];
      }
    }
  }
  if (currentGroup.length > 0) {
    clueGroups.push(currentGroup);
  }
  pattern = patternArr.join('');
  return { pattern, clueGroups };
};

const getArrangements = (pattern: string, numbers: number[]): number => {
  // filter the clues to remove the solved areas of the string
  let arrangements = 0;
  const patternArr = pattern.split('');
  const sum = tjMath.sum(numbers);
  const width = sum + numbers.length - 1;
  const length = patternArr.length;
  const margin = length - width;

  // only one possibility
  if (margin == 0) {
    return 1;
  }

  const questionMarkIndexes: number[] = [];
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] == '?') {
      questionMarkIndexes.push(i);
    }
  }

  const hashes = pattern.split('').filter((v) => v == '#').length;
  const requiredHashes = sum - hashes;
  let permutationString = '#'.repeat(requiredHashes);
  while (permutationString.length < questionMarkIndexes.length) {
    permutationString += '.';
  }
  const permutations = getPermutations(permutationString);

  for (const permutation of permutations) {
    const permutationArr = permutation.split('');
    let newPattern = pattern.split('');
    for (const index of questionMarkIndexes) {
      newPattern[index] = permutationArr.pop()!;
    }
    if (isValidPattern(newPattern.join(''), numbers)) {
      arrangements++;
    }
  }

  return arrangements;
};

const getGroupPermutations = (
  group: Clue[],
  patternAnswer: string,
  pattern: string,
  memo: Map<string, number> = new Map()
): number => {
  if (group.length == 0) {
    const patternHashes = pattern.split('').filter((v) => v == '#').length;
    const answerHashes = patternAnswer.split('').filter((v) => v == '#').length;
    return patternHashes === answerHashes ? 1 : 0;
  }
  let minIndex = pattern.length;
  let permutations = 0;
  const groups = [...group];
  const next = groups.shift()!;
  for (const permutation of next.possibleLocations) {
    if (permutation.min < minIndex) {
      continue;
    }

    let newPattern = pattern;
    let patternAnswerArr = patternAnswer.split('');
    while (newPattern.length < permutation.min) {
      newPattern += '.';
    }
    while (newPattern.length <= permutation.max) {
      patternAnswerArr[newPattern.length] = '#';
      newPattern += '#';
    }
    newPattern += '.';

    permutations += getGroupPermutations(groups, patternAnswerArr.join(''), newPattern, memo);
  }
  return permutations;
};

const getValidSolutionCount = (pattern: string, numbers: number[]): number => {
  let count = 1;
  const solveClues = getSolveClues(pattern, numbers);

  for (const group of solveClues.clueGroups) {
    const min = group[0].min;
    const max = group[group.length - 1].max;
    const subPattern = ('.'.repeat(min) + solveClues.pattern.substring(min, max + 1)).padEnd(
      solveClues.pattern.length,
      '.'
    );
    let permutations = getGroupPermutations(group, subPattern, '');
    if (permutations > 0) {
      count *= permutations;
    }
  }

  return count;
};

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(21, -1, -1, -1);
    super.setAnswers(21, 7843, 525152, 0);
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
    const answers =
      this.input.length == 6
        ? [1, 4, 1, 1, 4, 10]
        : [
            12, 1, 4, 1, 5, 1, 6, 2, 1, 2, 17, 14, 2, 1, 1, 6, 14, 10, 11, 10, 5, 12, 5, 12, 7, 6, 4, 1, 2, 1, 3, 15, 6,
            22, 47, 36, 6, 1, 2, 3, 1, 6, 6, 1, 3, 3, 1, 2, 6, 1, 16, 13, 8, 6, 4, 4, 7, 1, 3, 2, 20, 2, 9, 35, 3, 3, 3,
            1, 6, 3, 5, 6, 2, 2, 9, 1, 3, 3, 4, 83, 56, 2, 24, 80, 3, 4, 24, 3, 1, 1, 3, 7, 3, 4, 2, 4, 18, 2, 9, 2, 2,
            10, 3, 2, 1, 1, 4, 1, 1, 2, 6, 2, 2, 1, 3, 8, 65, 16, 3, 10, 10, 4, 3, 12, 24, 8, 6, 6, 13, 4, 34, 16, 3, 3,
            5, 4, 24, 20, 4, 3, 2, 2, 8, 3, 13, 4, 9, 2, 3, 4, 4, 15, 3, 9, 1, 2, 3, 9, 4, 12, 2, 2, 4, 2, 2, 2, 1, 3,
            2, 16, 2, 5, 2, 2, 8, 3, 1, 15, 6, 12, 6, 17, 8, 1, 5, 3, 3, 56, 5, 4, 3, 2, 1, 3, 19, 4, 7, 3, 8, 20, 40,
            39, 6, 4, 2, 2, 3, 2, 1, 3, 10, 10, 41, 37, 1, 10, 4, 2, 4, 48, 12, 3, 1, 14, 2, 1, 26, 2, 3, 1, 12, 31, 1,
            3, 1, 1, 1, 4, 3, 4, 5, 6, 28, 7, 8, 17, 3, 3, 3, 19, 2, 3, 5, 1, 1, 3, 8, 1, 5, 1, 4, 1, 2, 18, 1, 5, 6, 4,
            7, 3, 3, 4, 91, 6, 5, 25, 18, 14, 7, 56, 2, 16, 3, 3, 9, 3, 11, 10, 10, 3, 1, 4, 56, 2, 1, 3, 3, 3, 2, 3, 3,
            1, 11, 12, 10, 3, 2, 2, 1, 12, 2, 16, 1, 14, 11, 2, 8, 3, 6, 3, 5, 5, 5, 9, 2, 3, 15, 2, 12, 14, 2, 5, 2, 2,
            3, 3, 4, 2, 10, 10, 6, 9, 1, 1, 56, 4, 10, 4, 4, 13, 4, 2, 4, 4, 20, 9, 25, 4, 2, 4, 6, 4, 1, 1, 3, 5, 10,
            8, 3, 2, 3, 2, 5, 1, 1, 3, 6, 4, 6, 9, 6, 1, 4, 8, 1, 4, 1, 3, 2, 3, 10, 40, 4, 14, 3, 10, 4, 2, 30, 15, 3,
            10, 2, 2, 1, 1, 1, 3, 6, 6, 30, 6, 3, 15, 19, 6, 9, 1, 4, 23, 3, 13, 7, 3, 5, 3, 2, 2, 2, 2, 21, 1, 11, 1,
            3, 2, 2, 3, 10, 1, 2, 3, 2, 18, 4, 3, 6, 4, 1, 6, 1, 19, 3, 5, 7, 5, 10, 4, 2, 2, 2, 3, 10, 8, 4, 6, 3, 8,
            9, 3, 3, 3, 2, 2, 1, 3, 6, 16, 3, 3, 1, 4, 2, 56, 12, 1, 1, 13, 1, 15, 1, 4, 7, 58, 3, 5, 6, 5, 6, 4, 2, 1,
            4, 10, 4, 1, 1, 3, 6, 6, 4, 3, 1, 9, 5, 4, 1, 54, 4, 2, 13, 3, 8, 3, 31, 4, 30, 2, 6, 4, 23, 1, 4, 1, 2, 3,
            18, 4, 4, 2, 1, 17, 8, 12, 16, 8, 6, 5, 15, 12, 5, 2, 8, 7, 1, 1, 1, 25, 6, 2, 1, 1, 13, 2, 4, 2, 4, 6, 4,
            8, 2, 1, 6, 1, 6, 7, 1, 6, 2, 1, 9, 1, 2, 2, 6, 17, 1, 2, 8, 1, 5, 1, 25, 1, 13, 1, 2, 2, 4, 16, 2, 2, 6, 2,
            2, 5, 3, 2, 1, 6, 4, 12, 5, 3, 1, 17, 7, 6, 2, 14, 3, 4, 1, 1, 3, 18, 3, 8, 10, 8, 4, 10, 2, 2, 12, 30, 6,
            4, 2, 3, 2, 9, 4, 2, 4, 15, 4, 4, 3, 2, 2, 1, 2, 1, 8, 4, 1, 15, 1, 1, 11, 18, 3, 4, 2, 3, 3, 24, 3, 49, 3,
            4, 6, 12, 9, 7, 2, 23, 4, 6, 1, 52, 1, 1, 1, 3, 3, 6, 30, 2, 4, 18, 2, 4, 4, 24, 1, 3, 40, 2, 2, 3, 4, 1, 6,
            1, 1, 16, 4, 9, 21, 4, 10, 34, 2, 2, 11, 18, 2, 8, 3, 2, 4, 6, 6, 4, 18, 4, 2, 7, 3, 1, 1, 3, 12, 6, 5, 2,
            6, 6, 2, 8, 32, 7, 9, 3, 2, 1, 3, 2, 4, 3, 2, 2, 2, 9, 24, 2, 2, 2, 4, 22, 3, 31, 2, 6, 88, 4, 2, 17, 7, 12,
            13, 1, 3, 1, 14, 30, 2, 3, 6, 3, 2, 2, 6, 3, 7, 10, 2, 81, 4, 1, 2, 2, 2, 10, 8, 5, 3, 8, 3, 2, 2, 2, 9, 12,
            2, 17, 3, 35, 13, 35, 3, 3, 6, 9, 4, 46, 7, 2, 2, 2, 63, 25, 3, 2, 10, 1, 1, 2, 3, 2, 5, 32, 1, 16, 4, 6, 3,
            1, 9, 2, 2, 5, 4, 4, 6, 7, 4, 11, 3, 10, 6, 12, 7, 35, 2, 5, 7, 9, 2, 24, 36, 4, 10, 1, 4, 1, 7, 2, 4, 24,
            3, 2, 10, 12, 7, 3, 2, 2, 3, 16, 29, 1, 1, 3, 2, 4, 4, 3, 2, 2, 11, 2, 1, 4, 3, 3, 1, 1, 5, 16, 2, 1, 10, 2,
            126, 6, 58, 5, 4, 3, 2, 16, 2, 1, 19, 1, 4, 24, 7, 28, 6, 3, 27, 15, 3, 2, 3, 4, 6, 4, 10, 3, 2, 4, 2, 9, 3,
            1, 10, 3, 10, 2, 20, 3, 2, 1, 5, 2, 3, 2, 7, 2, 14, 12, 15, 106, 5, 4, 2, 4, 3, 2, 12, 33, 3, 9, 4, 32, 2,
            1, 2, 1, 2, 2, 17, 43, 2, 2, 15, 4, 2, 9, 1, 1, 10, 7, 3, 16, 5, 14, 8, 9, 6, 1, 5, 1, 6, 3,
          ];
    this.input.forEach((v, i) => {
      const { pattern, numbers } = v;
      const solution = getValidSolutionCount(pattern, numbers);
      if (solution != answers[i] && i < 20) {
        console.log(`${i + 1} is incorrect`);
        console.log(`${solution} != ${answers[i]}`);
      }
      solutions.push(solution);
    });
    // console.log(JSON.stringify(solutions));
    return tjMath.sum(solutions);
  };

  calculateAnswer2 = (): number => {
    const solutions: number[] = [];
    this.input.forEach((v) => {
      v.pattern = `${v.pattern}?${v.pattern}?${v.pattern}?${v.pattern}?${v.pattern}`;
      v.numbers = [...v.numbers, ...v.numbers, ...v.numbers, ...v.numbers, ...v.numbers];
    });
    this.input.forEach((v, i) => {
      const { pattern, numbers } = v;
      const solution = getValidSolutionCount(pattern, numbers);
      console.log(`${i + 1}: ${solution}`);
      solutions.push(solution);
    });
    // console.log(JSON.stringify(solutions));
    return tjMath.sum(solutions);
  };
}

export const puzzle = new Puzzle('2023', '12', PuzzleStatus.NOT_SOLVED);
