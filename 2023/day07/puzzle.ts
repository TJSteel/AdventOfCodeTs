import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

interface Hand {
  cards: string;
  multiplier: number;
  value: number;
}

const cardValue = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
};
const cardValueJokers = {
  A: 13,
  K: 12,
  Q: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  J: 1,
};
const handValue = (cards: string): number => {
  let counts = {
    A: 0,
    K: 0,
    Q: 0,
    J: 0,
    T: 0,
    9: 0,
    8: 0,
    7: 0,
    6: 0,
    5: 0,
    4: 0,
    3: 0,
    2: 0,
  };
  const letters = cards.split('');
  letters.forEach((v: string) => counts[v as keyof typeof counts]++);

  let value = 0;
  value += Object.values(counts).filter((v) => v == 5).length * 1000;
  value += Object.values(counts).filter((v) => v == 4).length * 100;
  value += Object.values(counts).filter((v) => v == 3).length * 10;
  value += Object.values(counts).filter((v) => v == 2).length;

  return value;
};
const handValueJokers = (cards: string): number => {
  let counts = {
    A: 0,
    K: 0,
    Q: 0,
    T: 0,
    9: 0,
    8: 0,
    7: 0,
    6: 0,
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    J: 0,
  };
  const letters = cards.split('');
  letters.forEach((v: string) => counts[v as keyof typeof counts]++);
  if (counts.J > 0) {
    const jokers = counts.J;
    counts.J = 0;
    const highestCount = Object.values(counts).sort((a, b) => b - a)[0];
    let key: any = null;
    for (const [k, v] of Object.entries(counts)) {
      if (v == highestCount) {
        key = k;
        break;
      }
    }
    counts[key as keyof typeof counts] += jokers;
  }

  let value = 0;
  value += Object.values(counts).filter((v) => v == 5).length * 1000;
  value += Object.values(counts).filter((v) => v == 4).length * 100;
  value += Object.values(counts).filter((v) => v == 3).length * 10;
  value += Object.values(counts).filter((v) => v == 2).length;

  return value;
};

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(6440, 248812215, 5905, 250057090, { highAnswers: { main2: [250499581] } });
  }

  parseInput(): void {
    this.input = this.input.map((i) => {
      const parts = i.split(' ');
      return {
        cards: parts[0],
        multiplier: parseInt(parts[1]),
        value: handValue(parts[0]),
        valueJokers: handValueJokers(parts[0]),
      } as Hand;
    });
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    this.input.sort((a, b) => {
      if (a.value === b.value) {
        for (let i = 0; i < 5; i++) {
          if (a.cards[i] !== b.cards[i]) {
            return cardValue[a.cards[i] as keyof typeof cardValue] - cardValue[b.cards[i] as keyof typeof cardValue];
          }
        }
        return 0;
      }
      return a.value - b.value;
    });
    for (let i = 0, len = this.input.length; i < len; i++) {
      answer += this.input[i].multiplier * (i + 1);
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    this.input.sort((a, b) => {
      if (a.valueJokers === b.valueJokers) {
        for (let i = 0; i < 5; i++) {
          if (a.cards[i] !== b.cards[i]) {
            return (
              cardValueJokers[a.cards[i] as keyof typeof cardValueJokers] -
              cardValueJokers[b.cards[i] as keyof typeof cardValueJokers]
            );
          }
        }
        return 0;
      }
      return a.valueJokers - b.valueJokers;
    });
    for (let i = 0, len = this.input.length; i < len; i++) {
      answer += this.input[i].multiplier * (i + 1);
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2023', '07', PuzzleStatus.COMPLETE);
