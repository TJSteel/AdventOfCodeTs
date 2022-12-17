import { Coordinate2d } from '../../core/coordinate2d';

export abstract class Rock {
  coords: Coordinate2d[];
  top: number;
  height: number;
  left: number;
  width: number;
  constructor() {
    this.coords = [];
    this.top = 0;
    this.height = 0;
    this.left = 0;
    this.width = 0;
  }
  moveSideways(amount: number) {
    this.left += amount;
    for (const coord of this.coords) {
      coord.x += amount;
    }
  }
  moveDown() {
    this.top--;
    for (const coord of this.coords) {
      coord.y--;
    }
  }
}

class HLineRock extends Rock {
  constructor(bottom: number) {
    super();
    this.coords.push(new Coordinate2d(2, bottom));
    this.coords.push(new Coordinate2d(3, bottom));
    this.coords.push(new Coordinate2d(4, bottom));
    this.coords.push(new Coordinate2d(5, bottom));
    this.top = bottom;
    this.height = 1;
    this.left = 2;
    this.width = 4;
  }
}

class PlusRock extends Rock {
  constructor(bottom: number) {
    super();
    this.coords.push(new Coordinate2d(3, bottom++));
    this.coords.push(new Coordinate2d(2, bottom));
    this.coords.push(new Coordinate2d(3, bottom));
    this.coords.push(new Coordinate2d(4, bottom++));
    this.coords.push(new Coordinate2d(3, bottom));
    this.top = bottom;
    this.height = 1;
    this.left = 2;
    this.width = 3;
  }
}

class LRock extends Rock {
  constructor(bottom: number) {
    super();
    this.coords.push(new Coordinate2d(2, bottom));
    this.coords.push(new Coordinate2d(3, bottom));
    this.coords.push(new Coordinate2d(4, bottom++));
    this.coords.push(new Coordinate2d(4, bottom++));
    this.coords.push(new Coordinate2d(4, bottom));
    this.top = bottom;
    this.height = 3;
    this.left = 2;
    this.width = 3;
  }
}

class VLineRock extends Rock {
  constructor(bottom: number) {
    super();
    this.coords.push(new Coordinate2d(2, bottom++));
    this.coords.push(new Coordinate2d(2, bottom++));
    this.coords.push(new Coordinate2d(2, bottom++));
    this.coords.push(new Coordinate2d(2, bottom));
    this.top = bottom;
    this.height = 4;
    this.left = 2;
    this.width = 1;
  }
}

class SquareRock extends Rock {
  constructor(bottom: number) {
    super();
    this.coords.push(new Coordinate2d(2, bottom));
    this.coords.push(new Coordinate2d(3, bottom++));
    this.coords.push(new Coordinate2d(2, bottom));
    this.coords.push(new Coordinate2d(3, bottom));
    this.top = bottom;
    this.height = 2;
    this.left = 2;
    this.width = 2;
  }
}

export const rocks = [HLineRock, PlusRock, LRock, VLineRock, SquareRock];
