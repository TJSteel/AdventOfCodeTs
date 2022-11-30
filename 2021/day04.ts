import { PuzzleStatus } from '../core/enums';
import { AbstractPuzzle } from '../core/puzzle';

function boardWin(board: any) {
  for (let line of board) {
    if (line.filter((x: string) => x == 'X').length == line.length) return true;
  }
  board = rotate2dArray(board, true);
  for (let line of board) {
    if (line.filter((x: string) => x == 'X').length == line.length) return true;
  }

  return false;
}

/** rotates a 2d array either clockwise or anticlockwise */
function rotate2dArray(array: any, clockwise: boolean) {
  let newArray: any = [];
  for (let x = 0, len = array.length; x < len; x++) {
    newArray[x] = [];
  }
  for (let x = 0, len = array.length; x < len; x++) {
    for (let y = 0; y < len; y++) {
      if (clockwise) {
        newArray[y][len - 1 - x] = array[x][y];
      } else {
        newArray[len - 1 - y][x] = array[x][y];
      }
    }
  }
  return newArray;
}

class Puzzle extends AbstractPuzzle {
  numbers: number[] = [];
  boards: Array<any> = [];
  setAnswers(): void {
    super.setAnswers(4512, 33348, 1924, 8112);
  }

  parseInput(): void {
    this.input = this.input.filter((v) => v);
    this.numbers = this.input[0].split(',').map((n: string) => parseInt(n));
    this.boards = [];
    for (let i = 1, len = this.input.length; i < len; i += 5) {
      let board = [];
      for (let j = 0; j < 5; j++) {
        board.push(
          this.input[i + j]
            .split(' ')
            .map((n: any) => parseInt(n))
            .filter((n: any) => !isNaN(n))
        );
      }
      this.boards.push(board);
    }
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    main: for (let number of this.numbers) {
      for (let i = 0, len = this.boards.length; i < len; i++) {
        this.boards[i] = this.boards[i].map((b: any) => b.map((n: any) => (n === number ? 'X' : n)));

        if (boardWin(this.boards[i])) {
          for (let line of this.boards[i]) {
            answer = line.reduce((acc: number, val: string) => acc + (val == 'X' ? 0 : parseInt(val)), answer);
          }
          answer *= number;
          break main;
        }
      }
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    main: for (let number of this.numbers) {
      for (let i = 0, len = this.boards.length; i < len; i++) {
        this.boards[i] = this.boards[i].map((b: any) => b.map((n: any) => (n === number ? 'X' : n)));

        if (boardWin(this.boards[i])) {
          if (len == 1) {
            for (let line of this.boards[i]) {
              answer = line.reduce((acc: number, val: string) => acc + (val == 'X' ? 0 : parseInt(val)), answer);
            }
            answer *= number;
            break main;
          } else {
            this.boards.splice(i, 1);
            i--;
            len--;
          }
        }
      }
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2021', '04', PuzzleStatus.COMPLETE);
