import { PuzzleStatus } from '../core/enums';
import { AbstractPuzzle } from '../core/puzzle';

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(26, 367, 61229, 974512);
  }

  parseInput(): void {
    this.input = this.input.map((i) => {
      let parts = i.split(' | ');
      return {
        combinations: parts[0].split(' ').map((c: string) => c.split('').sort().join('')),
        output: parts[1].split(' ').map((c: string) => c.split('').sort().join('')),
      };
    });
  }

  calculateAnswer1 = (): number => {
    let count = 0;
    for (let i of this.input) {
      for (let o of i.output) {
        switch (o.length) {
          case 2:
          case 3:
          case 4:
          case 7:
            count++;
            break;
        }
      }
    }
    return count;
  };

  calculateAnswer2 = (): number => {
    let total: number = 0;
    for (let i of this.input) {
      let numbers: Array<string> = ['', '', '', '', '', '', '', '', '', ''];
      let segments = [
        { seg: 'a', val: '', count: 0 },
        { seg: 'b', val: '', count: 0 },
        { seg: 'c', val: '', count: 0 },
        { seg: 'd', val: '', count: 0 },
        { seg: 'e', val: '', count: 0 },
        { seg: 'f', val: '', count: 0 },
        { seg: 'g', val: '', count: 0 },
      ];
      i.combinations
        .join('')
        .split('')
        .forEach((c: any) => {
          let segment = segments.find((s) => s.seg == c);
          if (segment) {
            segment.count++;
          }
        });
      let known: string[] = [];
      numbers[1] = i.combinations.find((c: string) => c.length == 2);
      numbers[4] = i.combinations.find((c: string) => c.length == 4);
      numbers[7] = i.combinations.find((c: string) => c.length == 3);
      numbers[8] = i.combinations.find((c: string) => c.length == 7);

      let aVal: string = numbers[7].split('').find((c) => !numbers[1].split('').find((n) => n == c))!;
      let aSeg = segments.find((s) => s.seg === aVal)!;
      aSeg.val = 'a';
      known.push(aVal);

      for (let segment of segments) {
        switch (segment.count) {
          case 4:
            segment.val = 'e';
            known.push(segment.seg);
            break;
          case 6:
            segment.val = 'b';
            known.push(segment.seg);
            break;
          case 9:
            segment.val = 'f';
            known.push(segment.seg);
            break;
        }
      }
      for (let segment of segments) {
        if (segment.count == 8 && segment.val == '') {
          segment.val = 'c';
          known.push(segment.seg);
        }
      }

      let dVal = numbers[4].split('').filter((n) => !known.includes(n))[0];
      let dSeg = segments.find((s) => s.seg === dVal)!;
      dSeg.val = 'd';
      known.push(dVal);

      for (let segment of segments) {
        if (segment.val == '') {
          segment.val = 'g';
          known.push(segment.seg);
        }
      }

      let chars = { a: '', b: '', c: '', d: '', e: '', f: '', g: '' };
      for (let segment of segments) {
        switch (segment.val) {
          case 'a':
            chars.a = segment.seg;
            break;
          case 'b':
            chars.b = segment.seg;
            break;
          case 'c':
            chars.c = segment.seg;
            break;
          case 'd':
            chars.d = segment.seg;
            break;
          case 'e':
            chars.e = segment.seg;
            break;
          case 'f':
            chars.f = segment.seg;
            break;
          case 'g':
            chars.g = segment.seg;
            break;
        }
      }

      numbers[0] = [chars.a, chars.b, chars.c, chars.e, chars.f, chars.g].sort().join('');
      numbers[2] = [chars.a, chars.c, chars.d, chars.e, chars.g].sort().join('');
      numbers[3] = [chars.a, chars.c, chars.d, chars.f, chars.g].sort().join('');
      numbers[5] = [chars.a, chars.b, chars.d, chars.f, chars.g].sort().join('');
      numbers[6] = [chars.a, chars.b, chars.d, chars.e, chars.f, chars.g].sort().join('');
      numbers[9] = [chars.a, chars.b, chars.c, chars.d, chars.f, chars.g].sort().join('');

      let valueStr: string = '';

      i.output.forEach((n: any) => {
        valueStr += numbers.findIndex((num) => num == n);
      });
      let valueNum: number = parseInt(valueStr);
      total += valueNum;
    }

    return total;
  };
}

export const puzzle = new Puzzle('2021', '08', PuzzleStatus.COMPLETE);
