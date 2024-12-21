import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  map: Array2d<string> = new Array2d();

  setAnswers(): void {
    super.setAnswers(5, 1404, 285, 1010981);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split(''));
    this.map = new Array2d({ data: this.input });
  }

  calculateAnswer = (minSaving: number, maxCheatTime: number): number => {
    let answer = 0;
    const startCoord = this.map.find((cell) => cell.value == 'S')!;
    const endCoord = this.map.find((cell) => cell.value == 'E')!;
    const shortestPath = this.map.getShortestPath(
      (cell) => cell == '.' || cell == 'E',
      startCoord,
      endCoord,
      Array2d.neighboursAdjacent
    )!;
    for (const coord of shortestPath) {
      this.map.setCell(coord, 'O');
    }
    const shortestPathLength = shortestPath.length;
    for (let a = 0; a < shortestPathLength; a++) {
      for (let b = a + minSaving + 1; b < shortestPathLength; b++) {
        const coordA: Coordinate2d = shortestPath[a];
        const coordB = shortestPath[b];
        const distance = coordA.manhattanDistance(coordB);
        const potentialSaving = b - a - distance;

        if (distance <= maxCheatTime && potentialSaving >= minSaving) {
          answer += 1;
        }
      }
    }
    return answer;
  };

  calculateAnswer1 = (): number => {
    const minSaving = this.isTest ? 20 : 100;
    const maxCheatTime = 2;
    return this.calculateAnswer(minSaving, maxCheatTime);
  };

  calculateAnswer2 = (): number => {
    const minSaving = this.isTest ? 50 : 100;
    const maxCheatTime = 20;

    return this.calculateAnswer(minSaving, maxCheatTime);
  };
}

export const puzzle = new Puzzle('2024', '20', PuzzleStatus.COMPLETE);
