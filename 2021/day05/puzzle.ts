import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

function updateMapHorizontal(loc: any, map: any) {
  let start = loc.x1 > loc.x2 ? loc.x2 : loc.x1;
  let end = loc.x1 > loc.x2 ? loc.x1 : loc.x2;
  let y = loc.y1;
  for (let x = start; x <= end; x++) {
    map[y][x] = map[y][x] === '.' ? 1 : map[y][x] + 1;
  }
}
function updateMapVertical(loc: any, map: any) {
  let start = loc.y1 > loc.y2 ? loc.y2 : loc.y1;
  let end = loc.y1 > loc.y2 ? loc.y1 : loc.y2;
  let x = loc.x1;
  for (let y = start; y <= end; y++) {
    map[y][x] = map[y][x] === '.' ? 1 : map[y][x] + 1;
  }
}
function updateMapDiagonal(loc: any, map: any) {
  let xDirection = loc.x1 > loc.x2 ? -1 : 1;
  let yDirection = loc.y1 > loc.y2 ? -1 : 1;
  let xEnd = loc.x2 + xDirection;
  let y = loc.y1;
  for (let x = loc.x1; x != xEnd; x += xDirection) {
    map[y][x] = map[y][x] === '.' ? 1 : map[y][x] + 1;
    y += yDirection;
  }
}

class Puzzle extends AbstractPuzzle {
  setAnswers(): void {
    super.setAnswers(5, 7473, 12, 24164);
  }

  parseInput(): void {
    this.input = this.input.filter((v) => v);
    let input = [];
    for (const line of this.input) {
      const locations = line
        .split(' -> ')
        .join(',')
        .split(',')
        .map((n: string) => parseInt(n));

      input.push({
        x1: locations[0],
        y1: locations[1],
        x2: locations[2],
        y2: locations[3],
      });
    }
    this.input = input;
  }

  calculateAnswer1 = (): number => {
    let inputAns1 = this.input.filter((i) => i.x1 === i.x2 || i.y1 === i.y2);
    let xLen = 0;
    let yLen = 0;
    inputAns1.forEach((i) => {
      if (i.x1 > xLen) xLen = i.x1;
      if (i.x2 > xLen) xLen = i.x2;
      if (i.y1 > yLen) yLen = i.y1;
      if (i.y2 > yLen) yLen = i.y2;
    });

    const map: any[] = [];
    const row = [];
    for (let i = 0; i <= xLen; i++) {
      row.push('.');
    }
    for (let i = 0; i <= yLen; i++) {
      map.push([...row]);
    }
    inputAns1.forEach((i) => {
      if (i.x1 === i.x2) {
        updateMapVertical(i, map);
      } else if (i.y1 === i.y2) {
        updateMapHorizontal(i, map);
      }
    });

    let answer = 0;
    map.forEach((row) => {
      row.forEach((cell: any) => {
        if (cell != '.' && cell > 1) answer++;
      });
    });

    return answer;
  };

  calculateAnswer2 = (): number => {
    let xLen = 0;
    let yLen = 0;
    this.input.forEach((i) => {
      if (i.x1 > xLen) xLen = i.x1;
      if (i.x2 > xLen) xLen = i.x2;
      if (i.y1 > yLen) yLen = i.y1;
      if (i.y2 > yLen) yLen = i.y2;
    });

    const map: any[] = [];
    const row = [];
    for (let i = 0; i <= xLen; i++) {
      row.push('.');
    }
    for (let i = 0; i <= yLen; i++) {
      map.push([...row]);
    }
    this.input.forEach((i) => {
      if (i.x1 === i.x2) {
        updateMapVertical(i, map);
      } else if (i.y1 === i.y2) {
        updateMapHorizontal(i, map);
      } else {
        updateMapDiagonal(i, map);
      }
    });

    let answer = 0;
    map.forEach((row) => {
      row.forEach((cell: any) => {
        if (cell != '.' && cell > 1) answer++;
      });
    });
    return answer;
  };
}

export const puzzle = new Puzzle('2021', '05', PuzzleStatus.COMPLETE);
