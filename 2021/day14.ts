import { PuzzleStatus } from '../core/enums';
import { AbstractPuzzle } from '../core/puzzle';

class Puzzle extends AbstractPuzzle {
  rules: any = {};
  charCount: any = {};

  setAnswers(): void {
    super.setAnswers(1588, 2851, 2188189693529, 10002813279337);
  }

  parseInput(): void {
    let polymer = this.input[0];
    this.rules = {};
    this.charCount = {};
    for (let i = 2, len = this.input.length; i < len; i++) {
      let parts = this.input[i].split(' -> ');
      this.rules[parts[0]] = { val: parts[1], count: 0 };
      if (!this.charCount[parts[1]]) {
        this.charCount[parts[1]] = 0;
      }
    }
    for (let i = 0, len = polymer.length; i < len; i++) {
      let c = polymer[i];
      this.charCount[c]++;
      if (i < len - 1) {
        this.rules[`${polymer[i]}${polymer[i + 1]}`].count++;
      }
    }
  }

  private _getAnswer(stepCount: number): number {
    for (let step = 0; step < stepCount; step++) {
      let rules = JSON.parse(JSON.stringify(this.rules));

      for (let key of Object.keys(rules)) {
        let rule = rules[key];
        if (rule.count > 0) {
          this.rules[key].count -= rules[key].count;
          this.charCount[rule.val] += rule.count;
          for (let k of [`${key[0]}${rule.val}`, `${rule.val}${key[1]}`]) {
            this.rules[k].count += rule.count;
          }
        }
      }
    }
    let largest = 0;
    let smallest = Infinity;
    for (let key of Object.keys(this.charCount)) {
      if (this.charCount[key] < smallest) smallest = this.charCount[key];
      if (this.charCount[key] > largest) largest = this.charCount[key];
    }
    return largest - smallest;
  }

  calculateAnswer1 = (): number => {
    return this._getAnswer(10);
  };

  calculateAnswer2 = (): number => {
    return this._getAnswer(40);
  };
}

export const puzzle = new Puzzle('2021', '14', PuzzleStatus.COMPLETE);
