import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

interface Range {
  from: number;
  to: number;
}

interface Action {
  on: boolean;
  x: Range;
  y: Range;
  z: Range;
}

const orientRange = (range: Range): Range => {
  if (range.from > range.to) {
    let from = range.from;
    range.from = range.to;
    range.to = from;
  }
  return range;
};

const limitRange = (minMax: Range, range: Range): boolean => {
  range.from = Math.max(minMax.from, range.from);
  range.to = Math.min(minMax.to, range.to);
  return range.from >= minMax.from && range.to <= minMax.to;
};

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(474140, 553201, 2758514936282235, -1);
  }

  parseInput(): void {
    this.input = this.input.map((i): Action => {
      let parts = i.split(' ');
      let coords = parts[1].split(',');
      for (let i = 0; i < 3; i++) {
        coords[i] = coords[i]
          .split('=')[1]
          .split('..')
          .map((v: string) => parseInt(v));
      }
      return {
        on: parts[0] == 'on',
        x: orientRange({ from: coords[0][0], to: coords[0][1] }),
        y: orientRange({ from: coords[1][0], to: coords[1][1] }),
        z: orientRange({ from: coords[2][0], to: coords[2][1] }),
      };
    });
  }

  doReboot = (): number => {
    let set = new Set();
    for (const i of this.input) {
      for (let x = i.x.from; x <= i.x.to; x++) {
        for (let y = i.y.from; y <= i.y.to; y++) {
          for (let z = i.z.from; z <= i.z.to; z++) {
            const coord = `${x},${y},${z}`;
            if (i.on) {
              set.add(coord);
            } else if (set.has(coord)) {
              set.delete(coord);
            }
          }
        }
      }
    }

    return set.size;
  };

  calculateAnswer1 = (): number => {
    const minMax: Range = { from: -50, to: 50 };
    this.input = this.input.filter(
      (i) => limitRange(minMax, i.x) && limitRange(minMax, i.y) && limitRange(minMax, i.z)
    );
    return this.doReboot();
  };

  calculateAnswer2 = (): number => {
    return this.doReboot();
  };
}

export const puzzle = new Puzzle('2021', '22', PuzzleStatus.IN_PROGRESS);
