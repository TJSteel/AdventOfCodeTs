import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { Blueprint } from './blueprint';
import { Robot, State } from './interfaces';

class Puzzle extends AbstractPuzzle {
  blueprints: Blueprint[] = [];

  setAnswers(): void {
    super.setAnswers(33, 1528, 3472, 16926);
  }

  parseInput(): void {
    this.blueprints = [];
    this.input.forEach((v) => this.blueprints.push(new Blueprint(v)));
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    for (const blueprint of this.blueprints) {
      const startState: State = {
        minute: 1,
        inventory: {
          resourceCount: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
          robotCount: { ore: 1, clay: 0, obsidian: 0, geode: 0 },
        },
        maxGeodes: 0,
      };
      Blueprint.maxGeodes = 0;
      const maxGeodes = blueprint.calculateTotalGeodes(startState);
      answer += maxGeodes * blueprint.id;
      // console.log(`Blueprint ${blueprint.id} has a max of ${maxGeodes}`);
    }

    return answer;
  };

  calculateAnswer2 = (): number => {
    Blueprint.totalMinutes = 32;
    let answer = 1;
    for (let i = 0, len = this.blueprints.length; i < 3 && i < len; i++) {
      const blueprint = this.blueprints[i];
      const startState: State = {
        minute: 1,
        inventory: {
          resourceCount: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
          robotCount: { ore: 1, clay: 0, obsidian: 0, geode: 0 },
        },
        maxGeodes: 0,
      };
      Blueprint.maxGeodes = 0;
      const maxGeodes = blueprint.calculateTotalGeodes(startState);
      answer *= maxGeodes;
      // console.log(`Blueprint ${blueprint.id} has a max of ${maxGeodes}`);
    }

    return answer;
  };
}

export const puzzle = new Puzzle('2022', '19', PuzzleStatus.INEFFICIENT);
