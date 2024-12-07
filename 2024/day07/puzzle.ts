import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

const isSumPossible = (
  answer: number,
  runningTotal: number,
  currentValue: number | null,
  operator: string,
  operators: string[],
  remainingValues: number[]
): boolean => {
  if (currentValue === null) {
    return runningTotal === answer;
  }
  switch (operator) {
    case 'add':
      runningTotal += currentValue;
      break;
    case 'multiply':
      runningTotal *= currentValue;
      break;
    case '||':
      runningTotal = parseInt(`${runningTotal}${currentValue}`);
      break;
  }

  if (remainingValues.length === 0) {
    return runningTotal === answer;
  } else {
    for (const operator of operators) {
      if (isSumPossible(answer, runningTotal, remainingValues[0], operator, operators, remainingValues.slice(1))) {
        return true;
      }
    }
  }
  return false;
};

class Puzzle extends AbstractPuzzle {
  sums: {
    answer: number;
    numbers: number[];
  }[] = [];
  setAnswers(): void {
    super.setAnswers(3749, 3119088655389, 11387, 264184041398847);
  }

  parseInput(): void {
    this.sums = this.input.map((v) => {
      const parts = v.split(': ');
      let answer = parseInt(parts[0]);
      let numbers = parts[1].split(' ').map(Number);
      return { answer, numbers };
    });
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    for (const sum of this.sums) {
      if (isSumPossible(sum.answer, sum.numbers[0], sum.numbers[0], '', ['add', 'multiply'], sum.numbers.slice(1))) {
        answer += sum.answer;
      }
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    for (const sum of this.sums) {
      if (
        isSumPossible(sum.answer, sum.numbers[0], sum.numbers[0], '', ['add', 'multiply', '||'], sum.numbers.slice(1))
      ) {
        answer += sum.answer;
      }
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2024', '07', PuzzleStatus.COMPLETE);
