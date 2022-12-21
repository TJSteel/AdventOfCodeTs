import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

interface Sum {
  left: number | string;
  operator: string;
  right: number | string;
}

interface Monkey {
  name: string;
  value: number | Sum;
}

const parseValue = (value: string): number | Sum => {
  const int = parseInt(value);
  if (!isNaN(int)) {
    return int;
  }

  const [left, operator, right] = value.split(' ');
  const sum: Sum = {
    left,
    operator,
    right,
  };
  const leftInt = parseInt(left);
  if (!isNaN(leftInt)) {
    sum.left = leftInt;
  }
  const rightInt = parseInt(right);
  if (!isNaN(rightInt)) {
    sum.right = rightInt;
  }

  return sum;
};

class Puzzle extends AbstractPuzzle {
  monkeys: Monkey[] = [];
  map: Map<string, number> = new Map();
  setAnswers(): void {
    super.setAnswers(152, 62386792426088, 301, 3876027196185);
  }

  parseInput(): void {
    this.monkeys = [];
    this.input
      .map((v) => v.split(': '))
      .forEach((v) => {
        const [name, value] = v;
        this.monkeys.push({ name, value: parseValue(value) });
      });
    this.map = new Map();
  }

  getInt(value: string | number): number | string {
    if (typeof value == 'string' && this.map.has(value)) {
      return this.map.get(value)!;
    }
    return value;
  }

  calculateRootValue(monkeys: Monkey[], equals: boolean = false): number {
    this.map = new Map();
    while (true) {
      for (let i = 0; i < monkeys.length; i++) {
        const monkey = monkeys[i];

        if (this.map.has(monkey.name)) {
          continue;
        }

        if (typeof monkey.value !== 'number') {
          monkey.value.left = this.getInt(monkey.value.left);
          monkey.value.right = this.getInt(monkey.value.right);
          if (typeof monkey.value.left == 'number' && typeof monkey.value.right == 'number') {
            const sum = eval(`${monkey.value.left} ${monkey.value.operator} ${monkey.value.right}`) as number;
            if (monkey.name === 'root') {
              if (equals) {
                return monkey.value.left - monkey.value.right;
              } else {
                return sum;
              }
            }
            monkey.value = sum;
          }
        }

        if (typeof monkey.value === 'number') {
          this.map.set(monkey.name, monkey.value);
          monkeys.splice(i--, 1);
        }
      }
    }
  }

  calculateAnswer1 = (): number => {
    return this.calculateRootValue(this.monkeys);
  };

  calculateAnswer2 = (): number => {
    const me = this.monkeys.find((monkey) => monkey.name === 'humn')!; // cspell:disable-line

    let a = 0;
    let b = 10000000000000;

    me.value = a;
    let monkeys = JSON.parse(JSON.stringify(this.monkeys));
    const differenceA = this.calculateRootValue(monkeys, true);
    me.value = b;
    monkeys = JSON.parse(JSON.stringify(this.monkeys));
    const differenceB = this.calculateRootValue(monkeys, true);
    const reversed = differenceA > differenceB;
    if (reversed) {
      let tmp = a;
      a = b;
      b = tmp;
    }

    const answer = 0;
    while (true) {
      const guess = Math.round((a + b) / 2);
      me.value = guess;
      const monkeys = JSON.parse(JSON.stringify(this.monkeys));
      const difference = this.calculateRootValue(monkeys, true);
      if (difference === 0) {
        return guess;
      }

      if (difference < answer) {
        a = guess;
      } else {
        b = guess;
      }
    }
  };
}

export const puzzle = new Puzzle('2022', '21', PuzzleStatus.COMPLETE);
