import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

let open = '([{<'.split('');
let close = ')]}>'.split('');

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(26397, 469755, 288957, 2762335572);
  }

  calculateAnswer1 = (): number => {
    let points: any = {
      ')': 3,
      ']': 57,
      '}': 1197,
      '>': 25137,
    };
    let answer = 0;
    for (let i of this.input) {
      let nextChars = [];
      let chars = i.split('');
      for (let c of chars) {
        if (open.includes(c)) {
          nextChars.push(c);
        } else {
          let expected = close[open.indexOf(nextChars.pop())];
          if (c != expected) {
            answer += points[c];
          }
        }
      }
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let points: any = {
      ')': 1,
      ']': 2,
      '}': 3,
      '>': 4,
    };
    let scores = [];
    outer: for (let i of this.input) {
      let nextChars = [];
      let chars = i.split('');
      for (let c of chars) {
        if (open.includes(c)) {
          nextChars.push(c);
        } else {
          let expected = close[open.indexOf(nextChars.pop())];
          if (c != expected) {
            continue outer;
          }
        }
      }
      let score = 0;
      nextChars = nextChars.reverse();
      for (let c of nextChars) {
        let expected = close[open.indexOf(c)];
        score *= 5;
        score += points[expected];
      }
      scores.push(score);
    }
    scores.sort((a, b) => a - b);
    let middle = Math.floor(scores.length / 2);
    return scores[middle];
  };
}

export const puzzle = new Puzzle('2021', '10', PuzzleStatus.COMPLETE);
