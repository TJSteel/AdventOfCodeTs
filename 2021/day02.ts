import { PuzzleStatus } from '../core/enums';
import { AbstractPuzzle } from '../core/puzzle';

class Puzzle extends AbstractPuzzle {
  private instructions: Array<{ direction: string; distance: number }> = [];
  setAnswers(): void {
    super.setAnswers(150, 2027977, 900, 1903644897);
  }

  parseInput(): void {
    this.instructions = [];
    for (let i of this.input) {
      let parts = i.split(' ');
      this.instructions.push({
        direction: parts[0],
        distance: parseInt(parts[1]),
      });
    }
  }

  calculateAnswer1 = (): number => {
    let horizontal = 0;
    let depth = 0;

    for (let i of this.instructions) {
      switch (i.direction) {
        case 'forward':
          horizontal += i.distance;
          break;
        case 'up':
          depth -= i.distance;
          break;
        case 'down':
          depth += i.distance;
          break;
      }
    }
    return horizontal * depth;
  };

  calculateAnswer2 = (): number => {
    let horizontal = 0;
    let depth = 0;
    let aim = 0;
    for (let i of this.instructions) {
      switch (i.direction) {
        case 'forward':
          horizontal += i.distance;
          depth += aim * i.distance;
          break;
        case 'up':
          aim -= i.distance;
          break;
        case 'down':
          aim += i.distance;
          break;
      }
    }
    return horizontal * depth;
  };
}

export const puzzle = new Puzzle('2021', '02', PuzzleStatus.COMPLETE);
