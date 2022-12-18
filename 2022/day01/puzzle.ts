import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Elf {
  calories: number[] = [];
  totalCalories: number = 0;
  addCalorie(calorie: number) {
    this.calories.push(calorie);
    this.totalCalories += calorie;
  }
}

class Puzzle extends AbstractPuzzle {
  elves: Elf[] = [];

  setAnswers(): void {
    super.setAnswers(24000, 70509, 45000, 208567);
  }

  parseInput(): void {
    this.elves = [];
    let i = 0;
    this.input = this.input.map((i) => parseInt(i));
    for (const calorie of this.input) {
      if (!calorie) {
        i++;
        continue;
      }
      if (!this.elves[i]) {
        this.elves[i] = new Elf();
      }
      this.elves[i].addCalorie(calorie);
    }
    this.elves.sort((a, b) => b.totalCalories - a.totalCalories);
  }

  calculateAnswer1 = (): number => {
    return this.elves[0].totalCalories;
  };

  calculateAnswer2 = (): number => {
    let total = 0;
    for (let i = 0; i <= 2; i++) {
      total += this.elves[i].totalCalories;
    }
    return total;
  };
}

export const puzzle = new Puzzle('2022', '01', PuzzleStatus.COMPLETE);
