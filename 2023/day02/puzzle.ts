import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(8, 2617, 2286, 59795);
  }

  parseInput(): void {
    this.input = this.input.map((game) =>
      game
        .split(': ')[1]
        .split('; ')
        .map((turn: string) => {
          const cubes = turn.split(', ');
          const cubeCounts = {
            red: 0,
            green: 0,
            blue: 0,
          };

          for (const cube of cubes) {
            const parts = cube.split(' ');
            const count = parseInt(parts[0]);
            const color = parts[1];
            cubeCounts[color as keyof typeof cubeCounts] += count;
          }
          return cubeCounts;
        })
    );
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    const maxCubeCounts = {
      red: 12,
      green: 13,
      blue: 14,
    };
    outer: for (let i = 0, len = this.input.length; i < len; i++) {
      const game = this.input[i];
      for (const move of game) {
        for (const [key, value] of Object.entries(maxCubeCounts)) {
          if (move[key] > value) {
            continue outer;
          }
        }
      }
      answer += i + 1;
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    for (let i = 0, len = this.input.length; i < len; i++) {
      const game = this.input[i];
      const minCubeCounts = {
        red: 0,
        green: 0,
        blue: 0,
      };
      for (const move of game) {
        for (const [key, value] of Object.entries(minCubeCounts)) {
          if (move[key] > value) {
            minCubeCounts[key as keyof typeof minCubeCounts] = move[key];
          }
        }
      }
      answer += Object.values(minCubeCounts).reduce((a, b) => a * b, 1);
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2023', '02', PuzzleStatus.COMPLETE);
