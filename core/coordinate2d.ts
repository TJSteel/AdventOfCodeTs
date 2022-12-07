import { tjMath } from './utils';

export class Coordinate2d {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString(): string {
    return `x: ${this.x}, y: ${this.y}`;
  }

  rotate(radians: number): void {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const x = this.x * cos - this.y * sin;
    const y = this.x * sin + this.y * cos;
    this.x = Math.round(x);
    this.y = Math.round(y);
  }

  rotateDegrees(degrees: number): void {
    const radians = tjMath.degreesToRadians(degrees);
    this.rotate(radians);
  }
}
