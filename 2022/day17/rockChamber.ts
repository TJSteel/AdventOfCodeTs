import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { Rock } from './rocks';

export class RockChamber {
  coords: Coordinate2d[];
  highestRock: number;
  width: number;
  constructor() {
    this.coords = [];
    this.highestRock = -1;
    this.width = 7;
  }

  printMap(rock?: Rock) {
    const map = new Array2d({ width: this.width, height: this.highestRock + 9, defaultValue: '.' });
    for (const coord of this.coords) {
      map.setCell(new Coordinate2d(coord.x, coord.y), '#');
    }
    if (rock) {
      for (const coord of rock.coords) {
        map.setCell(new Coordinate2d(coord.x, coord.y), '@');
      }
    }

    map.flipArrayY();
    map.print();
  }

  addRock(rock: Rock): void {
    for (const coord of rock.coords) {
      this.coords.push(coord);
      this.highestRock = Math.max(this.highestRock, coord.y);
    }
  }

  isCoordinateAvailable(coord: Coordinate2d) {
    if (coord.x < 0 || coord.x >= this.width || coord.y < 0) {
      return false;
    }
    if (coord.y > this.highestRock) {
      return true;
    }

    for (const c of this.coords) {
      if (c.equals(coord)) {
        return false;
      }
    }
    return true;
  }
}
