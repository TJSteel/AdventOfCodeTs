import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

const getExpandedGalaxies = (map: Array2d<string>, expansionSize: number): Coordinate2d[] => {
  const galaxies: { original: Coordinate2d; adjusted: Coordinate2d }[] = [];
  for (const cell of map) {
    if (cell.value === '#') {
      galaxies.push({ original: cell.coord, adjusted: new Coordinate2d(cell.coord.x, cell.coord.y) });
    }
  }

  for (let x = 0; x < map.getWidth(); x++) {
    const hasGalaxies = galaxies.filter((g) => g.original.x == x).length > 0;
    if (!hasGalaxies) {
      for (const galaxy of galaxies.filter((g) => g.original.x >= x)) {
        galaxy.adjusted.x += expansionSize - 1;
      }
    }
  }
  for (let y = 0; y < map.getHeight(); y++) {
    const hasGalaxies = galaxies.filter((g) => g.original.y == y).length > 0;
    if (!hasGalaxies) {
      for (const galaxy of galaxies.filter((g) => g.original.y >= y)) {
        galaxy.adjusted.y += expansionSize - 1;
      }
    }
  }
  return galaxies.map((v) => v.adjusted);
};

class Puzzle extends AbstractPuzzle {
  map: Array2d<string> = new Array2d();
  setAnswers(): void {
    super.setAnswers(374, 9599070, 82000210, 842645913794);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split(''));
    this.map = new Array2d({ data: this.input });
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    const adjustedGalaxies: Coordinate2d[] = getExpandedGalaxies(this.map, 2);

    for (let i = 0, len = adjustedGalaxies.length; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        answer += adjustedGalaxies[i].manhattanDistance(adjustedGalaxies[j]);
      }
    }

    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    const adjustedGalaxies: Coordinate2d[] = getExpandedGalaxies(this.map, 1000000);

    for (let i = 0, len = adjustedGalaxies.length; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        answer += adjustedGalaxies[i].manhattanDistance(adjustedGalaxies[j]);
      }
    }

    return answer;
  };
}

export const puzzle = new Puzzle('2023', '11', PuzzleStatus.COMPLETE);
