import { PuzzleStatus } from '../core/enums';
import { AbstractPuzzle } from '../core/puzzle';

const hasDuplicates = (str: string) => {
  const set: Set<string> = new Set();
  for (const char of str) {
    set.add(char);
  }
  return set.size != str.length;
};
const getPacketStart = (str: string, packetLength: number): number => {
  for (let i = 0, len = str.length - packetLength; i < len; i++) {
    if (!hasDuplicates(str.substring(i, i + packetLength))) {
      return i + packetLength;
    }
  }
  return -1;
};

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(7, 1093, 19, 3534);
  }

  calculateAnswer1 = (): number => {
    return getPacketStart(this.input[0], 4);
  };
  calculateAnswer2 = (): number => {
    return getPacketStart(this.input[0], 14);
  };
}

export const puzzle = new Puzzle('2022', '06', PuzzleStatus.COMPLETE);
