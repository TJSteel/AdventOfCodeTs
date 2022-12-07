import { Array2d } from '../core/array2d';
import { Coordinate2d } from '../core/coordinate2d';
import { PuzzleStatus } from '../core/enums';
import { AbstractPuzzle } from '../core/puzzle';

class Puzzle extends AbstractPuzzle {
  coords: Coordinate2d[] = [];
  instructions: { direction: string; value: number }[] = [];
  map: Array2d = new Array2d();
  sizeX = 0;
  sizeY = 0;

  setAnswers(): void {
    super.setAnswers(
      17,
      701,
      `
#####
#...#
#...#
#...#
#####
.....
.....`,
      `
####.###..####.#..#.###..####...##.#....
#....#..#.#....#.#..#..#.#.......#.#....
###..#..#.###..##...###..###.....#.#....
#....###..#....#.#..#..#.#.......#.#....
#....#....#....#.#..#..#.#....#..#.#....
#....#....####.#..#.###..####..##..####.`
    );
  }

  parseInput(): void {
    this.coords = [];
    this.instructions = [];
    let i = 0;
    let len = this.input.length;
    this.sizeX = 0;
    this.sizeY = 0;
    while (this.input[i]) {
      let parts = this.input[i].split(',');
      let coord = new Coordinate2d(parseInt(parts[0]), parseInt(parts[1]));
      this.coords.push(coord);
      if (coord.x > this.sizeX) {
        this.sizeX = coord.x;
      }
      if (coord.y > this.sizeY) {
        this.sizeY = coord.y;
      }
      i++;
    }
    i++;
    while (i < len) {
      let parts = this.input[i].substring(11).split('=');
      this.instructions.push({
        direction: parts[0],
        value: parseInt(parts[1]),
      });
      i++;
    }
    this.map = new Array2d({ width: this.sizeX + 1, height: this.sizeY + 1, defaultValue: '.' });
    this.coords.forEach((c) => {
      this.map.setCell(c, '#');
    });
  }

  calculateAnswer1 = (): number => {
    this.map.fold(this.instructions[0].direction, this.instructions[0].value);
    let answer = 0;
    for (let cell of this.map) {
      if (cell?.value === '#') {
        answer++;
      }
    }
    return answer;
  };

  calculateAnswer2 = (): string => {
    this.instructions.forEach((i) => {
      this.map.fold(i.direction, i.value);
    });
    return `
${this.map.toString()}`;
  };
}

export const puzzle = new Puzzle('2021', '13', PuzzleStatus.COMPLETE);
