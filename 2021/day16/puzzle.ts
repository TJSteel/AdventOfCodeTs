import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  i: number = 0;
  versions: number[] = [];
  packet: string = '';
  setAnswers(): void {
    super.setAnswers(31, 947, 54, 660797830937);
  }

  parseInput(): void {
    this.i = 0;
    this.versions = [];
    this.packet = this.input[0]
      .split('')
      .map((h: string) => {
        let bin = parseInt(h, 16).toString(2);
        for (let l = bin.length; l < 4; l++) {
          bin = '0' + bin;
        }
        return bin;
      })
      .join('');
  }

  readPacket(): number {
    this.versions.push(parseInt(this.packet.substring(this.i, this.i + 3), 2));
    this.i += 3;
    let type = parseInt(this.packet.substring(this.i, this.i + 3), 2);
    this.i += 3;

    if (type === 4) {
      // literal
      let bin = '';
      let end = false;
      while (!end) {
        bin += this.packet.substring(this.i + 1, this.i + 5);
        if (this.packet[this.i] === '0') {
          end = true;
        }
        this.i += 5;
      }
      return parseInt(bin, 2);
    } else {
      // operator
      let lengthType = this.packet[this.i];
      this.i++;
      let values = [];
      if (lengthType == '0') {
        // 15 bits total length
        let length = parseInt(this.packet.substring(this.i, this.i + 15), 2);
        this.i += 15;
        let end = this.i + length;
        while (this.i < end) {
          values.push(this.readPacket());
        }
      } else {
        // 11 bits number of sub-packets
        let packets = parseInt(this.packet.substring(this.i, this.i + 11), 2);
        this.i += 11;
        for (let p = 0; p < packets; p++) {
          values.push(this.readPacket());
        }
      }
      switch (type) {
        case 0: // sum
          return values.reduce((acc, val) => acc + val, 0);
        case 1: // product
          return values.reduce((acc, val) => acc * val, 1);
        case 2: // min
          return Math.min(...values);
        case 3: // max
          return Math.max(...values);
        case 5: // greater than
          return values[0] > values[1] ? 1 : 0;
        case 6: // less than
          return values[0] < values[1] ? 1 : 0;
        case 7: // equal to
          return values[0] === values[1] ? 1 : 0;
      }
    }
    return 0;
  }

  calculateAnswer1 = (): number => {
    this.readPacket();
    return this.versions.reduce((acc, val) => acc + val, 0);
  };

  calculateAnswer2 = (): number => {
    return this.readPacket();
  };
}

export const puzzle = new Puzzle('2021', '16', PuzzleStatus.COMPLETE);
