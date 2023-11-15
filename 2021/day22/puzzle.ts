import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { Cube } from './cube';

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(474140, 553201, 2758514936282235, 1263946820845866);
  }

  parseInput(): void {
    this.input = this.input.map((i): Cube => {
      let parts = i.split(' ');
      let coords = parts[1].split(',');
      for (let i = 0; i < 3; i++) {
        coords[i] = coords[i]
          .split('=')[1]
          .split('..')
          .map((v: string) => parseInt(v));
      }

      return new Cube(
        coords[0][0],
        coords[0][1],
        coords[1][0],
        coords[1][1],
        coords[2][0],
        coords[2][1],
        parts[0] == 'on'
      );
    });
  }

  doReboot = (): number => {
    const cubes: Cube[] = [];

    for (const currentCube of this.input) {
      const negativeCubes: Cube[] = [];
      for (const cube of cubes) {
        const intersection = currentCube.intersection(cube);
        if (intersection !== null) {
          intersection.on = !cube.on;
          negativeCubes.push(intersection);
        }
      }
      cubes.push(...negativeCubes);
      if (currentCube.on === true) {
        cubes.push(currentCube);
      }
    }

    let value = 0;
    for (const cube of cubes) {
      value += cube.getValue();
    }

    return value;
  };

  calculateAnswer1 = (): number => {
    const minMax: Cube = new Cube(-50, 50, -50, 50, -50, 50);
    this.input = this.input.filter((i) => i.limitCube(minMax));
    return this.doReboot();
  };

  calculateAnswer2 = (): number => {
    return this.doReboot();
  };
}

export const puzzle = new Puzzle('2021', '22', PuzzleStatus.COMPLETE);
