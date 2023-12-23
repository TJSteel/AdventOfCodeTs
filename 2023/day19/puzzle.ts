import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

interface Part {
  x: number;
  m: number;
  a: number;
  s: number;
}
interface PartRange {
  min: number;
  max: number;
}
interface PartRanges {
  x: PartRange;
  m: PartRange;
  a: PartRange;
  s: PartRange;
}

const getRangeCount = (ranges: PartRanges): number => {
  const x = ranges.x.max - ranges.x.min + 1;
  const m = ranges.m.max - ranges.m.min + 1;
  const a = ranges.a.max - ranges.a.min + 1;
  const s = ranges.s.max - ranges.s.min + 1;
  if (x <= 0 || m <= 0 || a <= 0 || s <= 0) {
    return 0;
  }
  return x * m * a * s;
};

class Puzzle extends AbstractPuzzle {
  workflows: Map<string, string> = new Map();
  parts: Part[] = [];

  setAnswers(): void {
    super.setAnswers(19114, 397134, 167409079868000, 127517902575337);
  }

  parseInput(): void {
    this.workflows = new Map();
    this.parts = [];

    for (const line of this.input.filter((v) => v)) {
      if (line[0] === '{') {
        // part
        let numbers = line
          .replace(/[\{\}]/g, '')
          .split(',')
          .map((v: string) => parseInt(v.split('=')[1]));
        this.parts.push({
          x: numbers[0],
          m: numbers[1],
          a: numbers[2],
          s: numbers[3],
        });
      } else {
        // workflow
        const key: string = line.split('{')[0];
        const instructions: string = line.match(/[\{](.*)[\}]/)[1];
        this.workflows.set(key, instructions);
      }
    }
  }

  evalStep(step: string, part: Part): string | boolean {
    if (step == 'A' || step == 'R' || step.indexOf(':') == -1) {
      return step;
    }
    const match = step.match(/(^.*)([\<\>])(.*)\:(.*)/);
    if (!match) {
      throw new Error(`eval regex failed for: ${step}`);
    }
    const partKey = match[1];
    const operator = match[2];
    const value = match[3];
    const answer = match[4];

    const partValue = part[partKey as keyof typeof part];

    if (eval(`${partValue}${operator}${value}`)) {
      return answer;
    }

    return false;
  }

  accepted(key: string, part: Part): boolean {
    const workflow = this.workflows.get(key);
    if (!workflow) {
      throw new Error(`workflow ${key} not found`);
    }
    for (const step of workflow.split(',')) {
      const evaluated = this.evalStep(step, part);
      if (evaluated === false) {
        continue;
      }
      const newKey = evaluated as string;
      switch (newKey) {
        case 'A':
          return true;
        case 'R':
          return false;
        default:
          return this.accepted(newKey, part);
      }
    }

    return false;
  }

  possibleCombinations(key: string, stepIndex: number, ranges: PartRanges): number {
    switch (key) {
      case 'A':
        return getRangeCount(ranges);
      case 'R':
        return 0;
    }
    const workflow = this.workflows.get(key);
    if (!workflow) {
      throw new Error(`workflow ${key} not found`);
    }
    const step = workflow.split(',')[stepIndex];
    if (!step) {
      throw new Error(`workflow ${key} step ${stepIndex} not found`);
    }

    switch (step) {
      case 'A':
        return getRangeCount(ranges);
      case 'R':
        return 0;
    }

    if (step.indexOf(':') == -1) {
      return this.possibleCombinations(step, 0, ranges);
    }

    // do some splitting to build a count from 2 paths
    // regex group
    const match = step.match(/(^.*)([\<\>])(.*)\:(.*)/);
    if (!match) {
      throw new Error(`eval regex failed for: ${step}`);
    }
    const partKey = match[1] as keyof typeof ranges;
    const operator = match[2];
    const value = parseInt(match[3]);
    const answer = match[4];

    if (operator === '<') {
      if (ranges[partKey].max < value) {
        // entire range is accepted
        return this.possibleCombinations(answer, 0, ranges);
      } else if (ranges[partKey].min > value) {
        // entire range is rejected
        return this.possibleCombinations(key, stepIndex + 1, ranges);
      } else {
        // range needs splitting
        let count = 0;
        const acceptedRanges = JSON.parse(JSON.stringify(ranges));
        acceptedRanges[partKey].max = value - 1;
        const rejectedRanges = JSON.parse(JSON.stringify(ranges));
        rejectedRanges[partKey].min = value;

        count += this.possibleCombinations(answer, 0, acceptedRanges);
        count += this.possibleCombinations(key, stepIndex + 1, rejectedRanges);
        return count;
      }
    } else if (operator === '>') {
      // to inverse of above
      if (ranges[partKey].min > value) {
        // entire range is accepted
        return this.possibleCombinations(answer, 0, ranges);
      } else if (ranges[partKey].max < value) {
        // entire range is rejected
        return this.possibleCombinations(key, stepIndex + 1, ranges);
      } else {
        // range needs splitting
        let count = 0;
        const acceptedRanges = JSON.parse(JSON.stringify(ranges));
        acceptedRanges[partKey].min = value + 1;
        const rejectedRanges = JSON.parse(JSON.stringify(ranges));
        rejectedRanges[partKey].max = value;

        count += this.possibleCombinations(answer, 0, acceptedRanges);
        count += this.possibleCombinations(key, stepIndex + 1, rejectedRanges);
        return count;
      }
    } else {
      throw new Error(`invalid operator: ${operator}`);
    }
    throw new Error(`Why am I here?`);
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    for (let part of this.parts) {
      if (!this.accepted('in', part)) {
        continue;
      }
      answer += part.x;
      answer += part.m;
      answer += part.a;
      answer += part.s;
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    const ranges: PartRanges = {
      x: { min: 1, max: 4000 },
      m: { min: 1, max: 4000 },
      a: { min: 1, max: 4000 },
      s: { min: 1, max: 4000 },
    };

    return this.possibleCombinations('in', 0, ranges);
  };
}

export const puzzle = new Puzzle('2023', '19', PuzzleStatus.COMPLETE);
