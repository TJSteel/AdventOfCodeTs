import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

interface Elf {
  coord: Coordinate2d;
  proposedMove: Coordinate2d | undefined;
}

interface Move {
  coords: Coordinate2d[];
}

const moves: Move[] = [
  // North
  { coords: [new Coordinate2d(0, -1), new Coordinate2d(-1, -1), new Coordinate2d(1, -1)] },
  // South
  { coords: [new Coordinate2d(0, 1), new Coordinate2d(-1, 1), new Coordinate2d(1, 1)] },
  // West
  { coords: [new Coordinate2d(-1, 0), new Coordinate2d(-1, -1), new Coordinate2d(-1, 1)] },
  // East
  { coords: [new Coordinate2d(1, 0), new Coordinate2d(1, -1), new Coordinate2d(1, 1)] },
];

class Puzzle extends AbstractPuzzle {
  elves: Elf[] = [];
  elfSet: Set<string> = new Set();
  moves: Move[] = [];

  setAnswers(): void {
    super.setAnswers(110, 4181, 20, 973, { testInputOnly: false, highAnswers: { main1: 4345 } });
  }

  parseInput(): void {
    this.elves = [];
    this.elfSet = new Set();
    this.input = this.input.map((v) => v.split(''));
    for (let y = 0, yLen = this.input.length; y < yLen; y++) {
      for (let x = 0, xLen = this.input[0].length; x < xLen; x++) {
        const cell = this.input[y][x];
        if (cell == '#') {
          const coord = new Coordinate2d(x, y);
          this.elves.push({ coord, proposedMove: undefined });
          this.elfSet.add(coord.toString());
        }
      }
    }
    this.moves = [...moves];
  }

  printMap(): void {
    const minCoord = new Coordinate2d(Infinity, Infinity);
    const maxCoord = new Coordinate2d(-Infinity, -Infinity);
    for (const elf of this.elves) {
      minCoord.x = Math.min(minCoord.x, elf.coord.x);
      minCoord.y = Math.min(minCoord.y, elf.coord.y);
      maxCoord.x = Math.max(maxCoord.x, elf.coord.x);
      maxCoord.y = Math.max(maxCoord.y, elf.coord.y);
    }
    const height = maxCoord.y - minCoord.y + 1;
    const width = maxCoord.x - minCoord.x + 1;
    const area = height * width - this.elves.length;
    const map: Array2d<string> = new Array2d({ width, height, defaultValue: '.' });
    for (const elf of this.elves) {
      map.setCell(elf.coord.copy().subtract(minCoord), '#');
    }
    map.print();
  }

  calculateMoves(): number {
    const moveMap: Map<string, number> = new Map();
    let elvesMoved = 0;

    // propose where to move
    for (const elf of this.elves) {
      elf.proposedMove = undefined;
      let neighbourCount = 0;
      for (const coord of Array2d.neighbours) {
        const offsetCoord = elf.coord.copy().add(coord);
        if (this.elfSet.has(offsetCoord.toString())) {
          neighbourCount++;
        }
      }
      if (neighbourCount == 0) {
        continue;
      }

      moveLoop: for (const move of this.moves) {
        for (const moveCoord of move.coords) {
          const offsetCoord = elf.coord.copy().add(moveCoord);
          if (this.elfSet.has(offsetCoord.toString())) {
            continue moveLoop;
          }
        }
        const proposedCoord = elf.coord.copy().add(move.coords[0]);
        const coordString = proposedCoord.toString();

        if (moveMap.has(coordString)) {
          moveMap.set(coordString, moveMap.get(coordString)! + 1);
        } else {
          moveMap.set(coordString, 1);
        }
        elf.proposedMove = proposedCoord;
        break;
      }
    }

    for (const elf of this.elves) {
      if (elf.proposedMove == undefined) {
        continue;
      }
      const proposedCount = moveMap.get(elf.proposedMove.toString());
      if (proposedCount == 1) {
        this.elfSet.delete(elf.coord.toString());
        elf.coord = elf.proposedMove.copy();
        this.elfSet.add(elf.coord.toString());
        elvesMoved++;
      }
    }

    this.moves.push(this.moves.shift()!);

    return elvesMoved;
  }

  calculateAnswer1 = (): number => {
    for (let i = 0; i < 10; i++) {
      this.calculateMoves();
    }
    const minCoord = new Coordinate2d(Infinity, Infinity);
    const maxCoord = new Coordinate2d(-Infinity, -Infinity);
    for (const elf of this.elves) {
      minCoord.x = Math.min(minCoord.x, elf.coord.x);
      minCoord.y = Math.min(minCoord.y, elf.coord.y);
      maxCoord.x = Math.max(maxCoord.x, elf.coord.x);
      maxCoord.y = Math.max(maxCoord.y, elf.coord.y);
    }
    const height = maxCoord.y - minCoord.y + 1;
    const width = maxCoord.x - minCoord.x + 1;
    const area = height * width - this.elves.length;

    return area;
  };

  calculateAnswer2 = (): number => {
    let answer = 1;
    while (this.calculateMoves() > 0) {
      answer++;
    }

    return answer;
  };
}

export const puzzle = new Puzzle('2022', '23', PuzzleStatus.COMPLETE);
