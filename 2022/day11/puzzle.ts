import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Monkey {
  id: number;
  items: number[];
  operation: string;
  divisible: number;
  ifTrue: number;
  ifFalse: number;
  inspected: number;
  constructor(input: string) {
    const lines = input.split('\n');
    this.id = parseInt(lines[0].split(':')[0].split(' ')[1]);
    this.items = lines[1]
      .split(': ')[1]
      .split(', ')
      .map((v) => parseInt(v));
    this.operation = lines[2].split('= ')[1];
    this.divisible = parseInt(lines[3].split('by ')[1]);
    this.ifTrue = parseInt(lines[4].split('monkey ')[1]);
    this.ifFalse = parseInt(lines[5].split('monkey ')[1]);
    this.inspected = 0;
  }

  doOperation(old: number) {
    this.inspected++;
    const oldStr = old.toString();

    const operation = this.operation.replace(/old/g, oldStr);
    old = eval(operation) as number;
    return old;
  }
}

class Puzzle extends AbstractPuzzle {
  monkeys: Monkey[] = [];
  setAnswers(): void {
    super.setAnswers(10605, 110220, 2713310158, 19457438264);
  }

  parseInput(): void {
    this.monkeys = [];
    this.input
      .join('\n')
      .split('\n\n')
      .forEach((monkey) => {
        this.monkeys.push(new Monkey(monkey));
      });
  }

  calculateMonkeyBusiness(rounds: number, worried: boolean): number {
    const product = this.monkeys
      .map((m) => m.divisible)
      .reduce((p, c) => {
        return p * c;
      }, 1);

    for (let i = 0; i < rounds; i++) {
      for (const monkey of this.monkeys) {
        for (const item of monkey.items) {
          let value = item;
          value = monkey.doOperation(value);
          if (!worried) {
            value = Math.floor(value / 3);
          }

          if (value % monkey.divisible == 0) {
            this.monkeys[monkey.ifTrue].items.push(value % product);
          } else {
            this.monkeys[monkey.ifFalse].items.push(value % product);
          }
        }
        monkey.items = [];
      }
    }

    this.monkeys.sort((a, b) => b.inspected - a.inspected);
    return this.monkeys[0].inspected * this.monkeys[1].inspected;
  }

  calculateAnswer1 = (): number => {
    return this.calculateMonkeyBusiness(20, false);
  };

  calculateAnswer2 = (): number => {
    return this.calculateMonkeyBusiness(10000, true);
  };
}

export const puzzle = new Puzzle('2022', '11', PuzzleStatus.INEFFICIENT);
