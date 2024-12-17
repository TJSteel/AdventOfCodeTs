import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

const getComboOperand = (operand: number, a: number, b: number, c: number): number => {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand;
    case 4:
      return a;
    case 5:
      return b;
    case 6:
      return c;
  }
  return -1;
};

const runProgram = (a: number, program: number[], answer: number[] | undefined = undefined): number[] => {
  const output: number[] = [];
  let outputSize = 0;
  let b = 0;
  let c = 0;

  let pointer = 0;
  // console.log(a);
  // console.log(a.toString(2));
  while (pointer < program.length - 1) {
    const opcode = program[pointer];
    let operand = program[pointer + 1];

    switch (opcode) {
      case 0:
        // Division
        a = Math.floor(a / Math.pow(2, getComboOperand(operand, a, b, c)));
        break;
      case 1:
        //bitwise XOR
        b = (b ^ operand) >>> 0;
        break;
      case 2:
        b = getComboOperand(operand, a, b, c) % 8;
        break;
      case 3:
        if (a !== 0) {
          pointer = operand;
          // console.log(a);
          // console.log(a.toString(2));
          continue;
          // pointer -= 2;
        }
        break;
      case 4:
        b = (b ^ c) >>> 0;
        break;
      case 5:
        output.push(getComboOperand(operand, a, b, c) % 8);
        if (answer != undefined && output[outputSize] != answer[outputSize]) {
          return output;
        }
        outputSize++;
        break;
      case 6:
        b = Math.floor(a / Math.pow(2, getComboOperand(operand, a, b, c)));
        break;
      case 7:
        c = Math.floor(a / Math.pow(2, getComboOperand(operand, a, b, c)));
        break;
    }
    pointer += 2;
  }
  return output;
};

class Puzzle extends AbstractPuzzle {
  registers: {
    a: number;
    b: number;
    c: number;
  } = { a: 0, b: 0, c: 0 };
  program: number[] = [];
  setAnswers(): void {
    super.setAnswers('5,7,3,0', '6,4,6,0,4,5,7,2,7', 117440, 164541160582845);
  }

  parseInput(): void {
    this.registers = {
      a: parseInt(this.input[0].split(': ')[1]),
      b: parseInt(this.input[1].split(': ')[1]),
      c: parseInt(this.input[2].split(': ')[1]),
    };
    this.program = this.input[4].split(': ')[1].split(',').map(Number);
  }

  calculateAnswer1 = (): string => {
    return runProgram(this.registers.a, [...this.program]).join(',');
  };

  calculateAnswer2 = (): number => {
    let a = 0;
    const startingProgramOutput = this.program.join(',');
    let programOutput = '';
    while (true) {
      programOutput = runProgram(a, [...this.program]).join(',');
      if (programOutput == startingProgramOutput) {
        return a;
      }
      if (startingProgramOutput.endsWith(programOutput) && !this.isTest) {
        a *= 8;
      } else {
        a++;
      }
    }
  };
}

export const puzzle = new Puzzle('2024', '17', PuzzleStatus.COMPLETE);
