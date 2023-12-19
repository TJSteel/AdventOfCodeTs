import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

interface Part {
  x: number;
  m: number;
  a: number;
  s: number;
}

class Puzzle extends AbstractPuzzle {
  workflows: Map<string, string> = new Map();
  parts: Part[] = [];

  setAnswers(): void {
    super.setAnswers(19114, 397134, 0, 0);
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

    if (eval(`${part[partKey as keyof typeof part]}${operator}${value}`)) {
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
    let answer = 0;

    return answer;
  };
}

export const puzzle = new Puzzle('2023', '19', PuzzleStatus.IN_PROGRESS);
