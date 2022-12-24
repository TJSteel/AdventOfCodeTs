import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { Blizzard } from './blizzard';
import { Board } from './board';

const directions = {
  '^': new Coordinate2d(0, -1),
  v: new Coordinate2d(0, 1),
  '<': new Coordinate2d(-1, 0),
  '>': new Coordinate2d(1, 0),
  wait: new Coordinate2d(0, 0),
};
const directionArr = Object.values(directions);

class Puzzle extends AbstractPuzzle {
  static readonly boardOffset: Coordinate2d = new Coordinate2d(-1, -1);
  blizzards: Blizzard[] = [];
  height: number = 0;
  width: number = 0;
  maxBoards: number = 0;
  boards: Board[] = [];
  coord: Coordinate2d = new Coordinate2d(0, 0);
  startCoord: Coordinate2d = new Coordinate2d(1, 0);
  endCoord: Coordinate2d = new Coordinate2d(0, 0);

  setAnswers(): void {
    super.setAnswers(18, 262, 54, 785, {
      testInputOnly: false,
      lowAnswers: { main1: 235, main2: 763 },
      highAnswers: { main1: 305 },
    });
  }

  parseInput(): void {
    this.blizzards = [];

    this.input = this.input.map((v) => v.split(''));
    this.height = this.input.length - 2;
    this.width = this.input[0].length - 2;
    this.maxBoards = this.height * this.width;
    Blizzard.bottomRight = new Coordinate2d(this.input[0].length - 2, this.input.length - 2);
    Blizzard.bottomRight.add(Puzzle.boardOffset);

    this.startCoord = new Coordinate2d(
      this.input[0].findIndex((v: string) => v == '.'),
      0
    );
    this.startCoord.add(Puzzle.boardOffset);

    this.endCoord = new Coordinate2d(
      this.input[this.input.length - 1].findIndex((v: string) => v == '.'),
      this.input.length - 1
    );
    this.endCoord.add(Puzzle.boardOffset);

    this.coord = this.startCoord.copy();

    for (let y = 1, yLen = this.input.length - 1; y < yLen; y++) {
      for (let x = 1, xLen = this.input[0].length - 1; x < xLen; x++) {
        const cell = this.input[y][x];
        const direction = directions[cell as keyof typeof directions];
        if (direction) {
          this.blizzards.push(new Blizzard(new Coordinate2d(x - 1, y - 1), direction));
        }
      }
    }
    this.boards = [new Board(this.blizzards, 0, this.width, this.height)];
  }

  calculateMoveCount(startCoord: Coordinate2d, endCoord: Coordinate2d, startMove: number): number {
    const cache: Set<string> = new Set();
    const initialState = {
      coord: startCoord.copy(),
      moveCount: startMove,
      moves: [] as Coordinate2d[],
    };
    let bigMove = 0;
    const queue = [initialState];
    while (queue.length > 0) {
      // queue.sort((a, b) => a.coord.manhattanDistance(this.endCoord) - b.coord.manhattanDistance(this.endCoord));
      // queue.sort((a, b) => a.moveCount - b.moveCount);

      const state = queue.shift()!;
      if (this.boards.length == state.moveCount) {
        this.boards.push(new Board(this.blizzards, state.moveCount, this.width, this.height));
      }

      const board: Board = this.boards[state.moveCount];

      if (state.moveCount > bigMove) {
        bigMove = state.moveCount;
        // console.log(`reached depth: ${bigMove}`);
      }

      for (const direction of directionArr) {
        const coord = state.coord.copy().add(direction);
        if (coord.equals(endCoord)) {
          // for (let i = 0; i < state.moveCount; i++) {
          //   const board = this.boards[i];
          //   if (i > 0 && board.map.inRange(state.moves[i - 1])) {
          //     board.map.setCell(state.moves[i - 1], 'E');
          //   }
          //   board.map.print();
          // }
          return state.moveCount;
        }
        if (!board.map.inRange(coord) && !coord.equals(startCoord) && !coord.equals(endCoord)) {
          continue;
        }
        const cell = board.map.getCell(coord);
        if (cell != '.' && !coord.equals(startCoord) && !coord.equals(endCoord)) {
          continue;
        }

        const stateStr = `${state.moveCount % this.maxBoards}${coord.toString()}`;
        if (cache.has(stateStr)) {
          continue;
        }
        cache.add(stateStr);
        queue.push({
          coord,
          moveCount: state.moveCount + 1,
          moves: [...state.moves, coord],
        });
      }
    }

    return -1;
  }

  calculateAnswer1 = (): number => {
    return this.calculateMoveCount(this.startCoord, this.endCoord, 1);
  };

  calculateAnswer2 = (): number => {
    const trip1 = this.calculateMoveCount(this.startCoord, this.endCoord, 1);
    const trip2 = this.calculateMoveCount(this.endCoord, this.startCoord, trip1 + 1);
    const trip3 = this.calculateMoveCount(this.startCoord, this.endCoord, trip2 + 1);
    // console.log(trip1);
    // console.log(trip2 - trip1);
    // console.log(trip3 - trip2);
    return trip3;
  };
}

export const puzzle = new Puzzle('2022', '24', PuzzleStatus.COMPLETE);
