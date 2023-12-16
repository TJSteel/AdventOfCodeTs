import { TjMath } from './utils/math';

export class Coordinate2d {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy(): Coordinate2d {
    return new Coordinate2d(this.x, this.y);
  }

  add(coord: Coordinate2d): Coordinate2d {
    this.x += coord.x;
    this.y += coord.y;
    return this;
  }

  subtract(coord: Coordinate2d): Coordinate2d {
    this.x -= coord.x;
    this.y -= coord.y;
    return this;
  }

  toString(): string {
    return `x: ${this.x}, y: ${this.y}`;
  }

  rotate(radians: number): Coordinate2d {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const x = this.x * cos - this.y * sin;
    const y = this.x * sin + this.y * cos;
    this.x = Math.round(x);
    this.y = Math.round(y);
    return this;
  }

  rotateDegrees(degrees: number): Coordinate2d {
    const radians = TjMath.degreesToRadians(degrees);
    this.rotate(radians);
    return this;
  }

  equals(coord: Coordinate2d) {
    return this.x == coord.x && this.y == coord.y;
  }

  manhattanDistance(coord: Coordinate2d) {
    return Math.abs(this.x - coord.x) + Math.abs(this.y - coord.y);
  }
}
