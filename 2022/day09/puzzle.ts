import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

const directions = {
  U: new Coordinate2d(0, -1),
  D: new Coordinate2d(0, 1),
  L: new Coordinate2d(-1, 0),
  R: new Coordinate2d(1, 0),
};
const movements = [
  {
    parent: new Coordinate2d(2, 0),
    child: new Coordinate2d(1, 0),
  },
  {
    parent: new Coordinate2d(2, 1),
    child: new Coordinate2d(1, 1),
  },
  {
    parent: new Coordinate2d(2, 2),
    child: new Coordinate2d(1, 1),
  },
  {
    parent: new Coordinate2d(1, 2),
    child: new Coordinate2d(1, 1),
  },
];
for (let r = 90; r < 360; r += 90) {
  for (let m = 0; m < 4; m++) {
    const movement = movements[m];
    const parent = new Coordinate2d(movement.parent.x, movement.parent.y);
    const child = new Coordinate2d(movement.child.x, movement.child.y);
    parent.rotateDegrees(r);
    child.rotateDegrees(r);
    movements.push({ parent, child });
  }
}
interface Move {
  direction: Coordinate2d;
  distance: number;
}
interface RopeSegment {
  current: Coordinate2d;
  previous: Coordinate2d;
}

const getTailLocationCount = (length: number, moves: Move[]): number => {
  const tail = length - 1;
  const rope: RopeSegment[] = [];
  const tailLocations = new Set();
  const printRope = () => {
    let minX = rope[0].current.x;
    let minY = rope[0].current.y;
    let maxX = rope[0].current.x;
    let maxY = rope[0].current.y;
    for (const r of rope) {
      minX = Math.min(minX, r.current.x);
      minY = Math.min(minY, r.current.y);
      maxX = Math.max(maxX, r.current.x);
      maxY = Math.max(maxY, r.current.y);
    }
    let offsetX = minX * -1;
    let offsetY = minY * -1;
    maxX += offsetX;
    maxY += offsetY;
    const grid = new Array2d({ width: maxX + 1, height: maxY + 1, defaultValue: '.' });
    for (let i = length - 1; i >= 0; i--) {
      const r = rope[i];
      grid.setCell(new Coordinate2d(r.current.x + offsetX, r.current.y + offsetY), i);
    }
    grid.print();
  };

  for (let i = 0; i < length; i++) {
    rope.push({
      current: new Coordinate2d(0, 0),
      previous: new Coordinate2d(0, 0),
    });
  }
  tailLocations.add(rope[tail].current.toString());

  for (const move of moves) {
    for (let i = 0; i < move.distance; i++) {
      // move the head
      rope[0].previous.x = rope[0].current.x;
      rope[0].previous.y = rope[0].current.y;
      rope[0].current.x += move.direction.x;
      rope[0].current.y += move.direction.y;

      // move each other segment
      for (let s = 1; s < length; s++) {
        const parent = rope[s - 1];
        const current = rope[s];
        current.previous.x = current.current.x;
        current.previous.y = current.current.y;

        const moveX = parent.current.x - current.current.x;
        const moveY = parent.current.y - current.current.y;
        const moveCoord = new Coordinate2d(moveX, moveY);

        const movement = movements.find((m) => m.parent.equals(moveCoord));
        if (movement) {
          current.current.x += movement.child.x;
          current.current.y += movement.child.y;
        }
      }
      if (!tailLocations.has(rope[tail].current.toString())) {
        tailLocations.add(rope[tail].current.toString());
      }
    }
    // printRope();
  }

  return tailLocations.size;
};

class Puzzle extends AbstractPuzzle {
  moves: Move[] = [];
  setAnswers(): void {
    super.setAnswers(88, 6266, 36, 2369);
  }

  parseInput(): void {
    this.moves = [];
    this.input
      .map((v) => v.split(' '))
      .forEach((move) => {
        let d: string = move[0];
        this.moves.push({
          direction: directions[d as keyof typeof directions],
          distance: parseInt(move[1]),
        });
      });
  }

  calculateAnswer1 = (): number => {
    return getTailLocationCount(2, this.moves);
  };

  calculateAnswer2 = (): number => {
    return getTailLocationCount(10, this.moves);
  };
}

export const puzzle = new Puzzle('2022', '09', PuzzleStatus.COMPLETE);
