import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

enum CubeType {
  PIECE,
  EXTERNAL,
  INTERNAL,
}

const offsets = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

class Puzzle extends AbstractPuzzle {
  coordMap: Map<string, CubeType> = new Map();
  coords: number[][] = [];

  min: number[] = [];
  max: number[] = [];

  setAnswers(): void {
    super.setAnswers(64, 3364, 58, 2006);
  }

  parseInput(): void {
    this.coords = [];
    this.coordMap = new Map();
    for (const i of this.input) {
      this.coordMap.set(i, CubeType.PIECE);
      this.coords.push(i.split(',').map((v: string) => parseInt(v)));
    }
  }

  calculateSurfaceArea(exterior: boolean): number {
    let answer = this.input.length * 6;

    for (const coord of this.coords) {
      for (const offset of offsets) {
        const offsetCoord = [coord[0] + offset[0], coord[1] + offset[1], coord[2] + offset[2]].join(',');
        const offsetPiece = this.coordMap.get(offsetCoord);
        if (offsetPiece == CubeType.PIECE) {
          answer--;
        }
        if (exterior && offsetPiece == undefined) {
          answer--;
        }
      }
    }
    return answer;
  }

  setMinMax() {
    this.min = [Infinity, Infinity, Infinity];
    this.max = [-Infinity, -Infinity, -Infinity];
    for (const coord of this.coords) {
      for (let i = 0; i < 3; i++) {
        this.min[i] = Math.min(this.min[i], coord[i]);
        this.max[i] = Math.max(this.max[i], coord[i]);
      }
    }
  }

  setCubeType(x: number, y: number, z: number, offset: number): void {
    const coordString = [x, y, z].join(',');
    if (this.coordMap.has(coordString)) {
      return;
    }

    if (offset == -1) {
      this.coordMap.set(coordString, CubeType.EXTERNAL);
      return;
    }

    for (let offset of offsets) {
      const offsetCoordString = [x + offset[0], y + offset[1], z + offset[2]].join(',');
      const neighbour = this.coordMap.get(offsetCoordString);
      if (!neighbour) {
        continue;
      } else if (neighbour === CubeType.EXTERNAL) {
        this.coordMap.set(coordString, CubeType.EXTERNAL);
        return;
      }
    }
    this.coordMap.set(coordString, CubeType.INTERNAL);
  }

  /** Returns if in bounds of the piece including a border
   *
   * @param x
   * @param y
   * @param z
   * @returns true if in bounds, false if not
   */
  inBounds(x: number, y: number, z: number, border: number = 1): boolean {
    if (
      x < this.min[0] - border ||
      x > this.max[0] + border ||
      y < this.min[1] - border ||
      y > this.max[1] + border ||
      z < this.min[2] - border ||
      z > this.max[2] + border
    ) {
      return false;
    }

    return true;
  }

  flood() {
    const start = this.min.map((v) => v - 1);

    const queue = [start];
    while (queue.length > 0) {
      const coord = queue.shift()!;
      const coordString = coord.join(',');
      if (this.coordMap.has(coordString)) {
        continue;
      }
      this.coordMap.set(coordString, CubeType.EXTERNAL);
      for (const offset of offsets) {
        const offsetCoord = [coord[0] + offset[0], coord[1] + offset[1], coord[2] + offset[2]];
        const offsetCoordString = offsetCoord.join(',');
        if (this.inBounds(offsetCoord[0], offsetCoord[1], offsetCoord[2]) && !this.coordMap.has(offsetCoordString)) {
          queue.push(offsetCoord);
        }
      }
    }
  }

  calculateAnswer1 = (): number => {
    return this.calculateSurfaceArea(false);
  };

  calculateAnswer2 = (): number => {
    this.setMinMax();
    this.flood();
    return this.calculateSurfaceArea(true);
  };
}

export const puzzle = new Puzzle('2022', '18', PuzzleStatus.COMPLETE);
