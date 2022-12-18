import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  private octopuses!: Array2d;
  private flashed!: Array2d;
  private flashes: number = 0;
  private queue: Array<Coordinate2d> = [];

  setAnswers(): void {
    super.setAnswers(1656, 1713, 195, 502);
  }

  parseInput(): void {
    let width = this.input[0].length;
    let height = 0;
    this.octopuses = new Array2d({ width, height });
    this.flashed = new Array2d({ width, height });
    this.input.forEach((i) => {
      this.octopuses.addRow(i.split('').map((n: any) => parseInt(n)));
      this.flashed.addRow(i.split('').map(() => false));
    });
  }

  flash(coord: Coordinate2d) {
    this.flashed.setCell(coord, true);
    this.flashes++;
    for (let nCoord of this.octopuses.getNeighbours(coord)) {
      this.queue.push(nCoord);
      this.octopuses.setCell(nCoord, this.octopuses.getCell(nCoord) + 1);
    }
  }

  resetFlashed() {
    for (let flashed of this.flashed) {
      if (flashed?.value) {
        this.flashed.setCell(flashed.coord, false);
        this.octopuses.setCell(flashed.coord, 0);
      }
    }
  }

  synchronised(): boolean {
    for (let octopus of this.octopuses) {
      if (octopus && octopus.value !== 0) {
        return false;
      }
    }
    return true;
  }

  calculateAnswer1 = (): number => {
    this.flashes = 0;

    for (let step = 1; step <= 100; step++) {
      for (let octopus of this.octopuses) {
        if (octopus !== undefined) {
          this.octopuses.setCell(octopus.coord, octopus.value + 1);
          this.flashed.setCell(octopus.coord, false);
        }
      }

      this.queue = [];
      for (let octopus of this.octopuses) {
        if (octopus) {
          this.queue.push(octopus.coord);
        }
      }
      while (this.queue.length > 0) {
        let coord = this.queue.shift()!;
        if (this.octopuses.getCell(coord) > 9 && !this.flashed.getCell(coord)) {
          this.flash(coord);
        }
      }

      this.resetFlashed();
    }
    return this.flashes;
  };

  calculateAnswer2 = (): number => {
    this.flashes = 0;

    let step = 0;
    while (!this.synchronised()) {
      step++;
      for (let octopus of this.octopuses) {
        if (octopus !== undefined) {
          this.octopuses.setCell(octopus.coord, octopus.value + 1);
          this.flashed.setCell(octopus.coord, false);
        }
      }

      this.queue = [];
      for (let octopus of this.octopuses) {
        if (octopus) {
          this.queue.push(octopus.coord);
        }
      }
      while (this.queue.length > 0) {
        let coord = this.queue.shift()!;
        if (this.octopuses.getCell(coord) > 9 && !this.flashed.getCell(coord)) {
          this.flash(coord);
        }
      }

      this.resetFlashed();
    }
    return step;
  };
}

export const puzzle = new Puzzle('2021', '11', PuzzleStatus.COMPLETE);
