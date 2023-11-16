import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { Level } from './level';

class Puzzle extends AbstractPuzzle {
  level!: Level;
  setAnswers(): void {
    super.setAnswers(12521, 13336, -1, -1);
  }

  parseInput(): void {
    this.level = new Level();
    this.level.buildLevel(this.input);
  }

  calculateAnswer1 = (): number => {
    return this.level.solve();
  };

  calculateAnswer2 = (): number => {
    let answer = 0;

    return answer;
  };
}

export const puzzle = new Puzzle('2021', '23', PuzzleStatus.IN_PROGRESS);
