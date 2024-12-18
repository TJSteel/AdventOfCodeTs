import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  map: Array2d<string> = new Array2d();
  memoryCoords: Coordinate2d[] = [];

  setAnswers(): void {
    super.setAnswers(22, 374, '6,1', '30,12');
  }

  parseInput(): void {
    this.memoryCoords = this.input
      .map((i) => i.split(',').map(Number))
      .map((numbers: number[]) => new Coordinate2d(numbers[0], numbers[1]));

    if (this.isTest) {
      this.map = new Array2d({ width: 7, height: 7, defaultValue: '.' });
    } else {
      this.map = new Array2d({ width: 71, height: 71, defaultValue: '.' });
    }
  }

  calculateAnswer1 = (): number => {
    if (this.isTest) {
      for (const coord of this.memoryCoords.slice(0, 12)) {
        this.map.setCell(coord, '#');
      }
    } else {
      for (const coord of this.memoryCoords.slice(0, 1024)) {
        this.map.setCell(coord, '#');
      }
    }
    const startCoord = new Coordinate2d(0, 0);
    const endCoord = new Coordinate2d(this.map.getWidth() - 1, this.map.getHeight() - 1);
    const shortestPath = this.map.getShortestPath(
      (cellValue) => cellValue == '.',
      startCoord,
      endCoord,
      Array2d.neighboursAdjacent
    );
    if (shortestPath !== null) {
      for (const coord of shortestPath) {
        this.map.setCell(coord, 'O');
      }
      return shortestPath.length - 1;
    } else {
      return 0;
    }
  };

  calculateAnswer2 = (): string => {
    const startCoord = new Coordinate2d(0, 0);
    const endCoord = new Coordinate2d(this.map.getWidth() - 1, this.map.getHeight() - 1);
    let shortestPath: Coordinate2d[] = this.map.getShortestPath(
      (cellValue) => cellValue == '.',
      startCoord,
      endCoord,
      Array2d.neighboursAdjacent
    )!;
    for (const coord of this.memoryCoords) {
      this.map.setCell(coord, '#');
      if (shortestPath.find((c) => c.equals(coord))) {
        let newPath = this.map.getShortestPath(
          (cellValue) => cellValue == '.',
          startCoord,
          endCoord,
          Array2d.neighboursAdjacent
        );
        if (newPath == null) {
          return `${coord.x},${coord.y}`;
        } else {
          shortestPath = newPath;
        }
      }
    }
    return 'WTF!';
  };
}

export const puzzle = new Puzzle('2024', '18', PuzzleStatus.COMPLETE);
