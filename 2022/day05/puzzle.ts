import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

interface instruction {
  count: number;
  from: number;
  to: number;
}

class Puzzle extends AbstractPuzzle {
  instructions: instruction[] = [];
  stacks: any;
  setAnswers(): void {
    super.setAnswers('CMZ', 'CNSZFDVLJ', 'MCD', 'QNDWLMGNS'); // cspell:disable-line
  }

  parseInput(): void {
    this.stacks = [];
    this.input
      .filter((v: string) => v.includes('['))
      .reverse()
      .forEach((stack) => {
        for (let s = 0, i = 1, len = stack.length; i < len; i += 4, s++) {
          const char = stack.charAt(i);

          if (this.stacks[s] == undefined) {
            this.stacks[s] = [];
          }
          if (char != ' ') {
            this.stacks[s].push(char);
          }
        }
      });
    this.instructions = this.input
      .filter((v: string) => v.includes('move'))
      .map((v): instruction => {
        const parts = v.split(' ').map((v: string) => parseInt(v));
        const count = parts[1];
        const from = parts[3] - 1;
        const to = parts[5] - 1;
        return { count, from, to };
      });
  }

  calculateAnswer1 = (): string => {
    this.instructions.forEach((instruction) => {
      const craneItems = this.stacks[instruction.from].splice(instruction.count * -1).reverse();
      this.stacks[instruction.to].push(...craneItems);
    });
    return this.stacks.map((v: any) => v.pop()).join('');
  };

  calculateAnswer2 = (): string => {
    this.instructions.forEach((instruction) => {
      const craneItems = this.stacks[instruction.from].splice(instruction.count * -1);
      this.stacks[instruction.to].push(...craneItems);
    });
    return this.stacks.map((v: any) => v.pop()).join('');
  };
}

export const puzzle = new Puzzle('2022', '05', PuzzleStatus.COMPLETE);
