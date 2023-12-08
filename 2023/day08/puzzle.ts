import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { tjMath } from '../../core/utils';

class Puzzle extends AbstractPuzzle {
  map: any = {};
  directions: string = '';

  setAnswers(): void {
    super.setAnswers(2, 20093, 6, 22103062509257);
  }

  parseInput(): void {
    this.map = {};
    this.directions = this.input[0];
    this.input.shift();
    this.input.shift();
    this.input.forEach((i) => {
      const parts = i.split(' ');

      this.map[parts[0]] = {
        L: parts[2].substring(1, 4),
        R: parts[3].substring(0, 3),
      };
    });
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    let location = 'AAA';
    let index = 0;
    let length = this.directions.length;
    while (location !== 'ZZZ') {
      const map = this.map[location];
      const direction = this.directions[index++];
      location = map[direction];
      if (index === length) {
        index = 0;
      }
      answer++;
    }

    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    const locations: string[] = Object.keys(this.map).filter((v) => v[2] === 'A');
    let index = 0;
    let length = this.directions.length;
    const answers: number[] = [];
    while (locations.length > 0) {
      answer++;
      const direction = this.directions[index];

      for (let i = 0; i < locations.length; i++) {
        const map = this.map[locations[i]];
        locations[i] = map[direction];
        if (locations[i][2] === 'Z') {
          answers.push(answer);
          locations.splice(i, 1);
          i--;
        }
      }

      if (++index === length) {
        index = 0;
      }
    }
    return tjMath.lowestCommonMultiple(answers);
  };
}

export const puzzle = new Puzzle('2023', '08', PuzzleStatus.COMPLETE);
