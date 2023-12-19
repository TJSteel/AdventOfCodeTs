import { Array2d } from '../../core/array2d';
import { Blizzard } from './blizzard';

const directions = {
  'x: 1, y: 0': '>',
  'x: -1, y: 0': '<',
  'x: 0, y: -1': '^',
  'x: 0, y: 1': 'v',
};

export class Board {
  map: Array2d<string>;
  constructor(blizzards: Blizzard[], moveCount: number, width: number, height: number) {
    this.map = new Array2d({ width, height, defaultValue: '.' });
    for (const blizzard of blizzards) {
      const coord = blizzard.getPositionAfter(moveCount);
      const cell = this.map.getCell(coord)!;
      if (cell != '.') {
        let int = parseInt(cell);
        if (isNaN(int)) {
          this.map.setCell(coord, 2 + '');
        } else {
          this.map.setCell(coord, ++int + '');
        }
      } else {
        this.map.setCell(coord, directions[blizzard.direction.toString() as keyof typeof directions]);
      }
    }
    // this.map.print();
  }
  getState(): string {
    let state = '';
    for (const v of this.map) {
      state += v.value;
    }
    return state;
  }
}
