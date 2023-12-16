import { TjMath } from './utils/math';

export class Coordinate3d {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  copy(): Coordinate3d {
    return new Coordinate3d(this.x, this.y, this.z);
  }

  add(coord: Coordinate3d): Coordinate3d {
    this.x += coord.x;
    this.y += coord.y;
    this.z += coord.z;
    return this;
  }

  subtract(coord: Coordinate3d): Coordinate3d {
    this.x -= coord.x;
    this.y -= coord.y;
    this.z -= coord.z;
    return this;
  }

  toString(): string {
    return `x: ${this.x}, y: ${this.y}, z: ${this.z}`;
  }

  rotate(radians: Coordinate3d): Coordinate3d {
    if (radians.x !== 0) {
      const cos = Math.cos(radians.x);
      const sin = Math.sin(radians.x);
      const y = this.y * cos - this.z * sin;
      const z = this.y * sin + this.z * cos;
      this.y = Math.round(y);
      this.z = Math.round(z);
    }
    if (radians.y !== 0) {
      const cos = Math.cos(radians.y);
      const sin = Math.sin(radians.y);
      const z = this.z * cos - this.x * sin;
      const x = this.z * sin + this.x * cos;
      this.x = Math.round(x);
      this.z = Math.round(z);
    }
    if (radians.z !== 0) {
      const cos = Math.cos(radians.z);
      const sin = Math.sin(radians.z);
      const x = this.x * cos - this.y * sin;
      const y = this.x * sin + this.y * cos;
      this.x = Math.round(x);
      this.y = Math.round(y);
    }
    return this;
  }

  rotateDegrees(degrees: Coordinate3d): Coordinate3d {
    const radians: Coordinate3d = degrees.copy();
    radians.x = TjMath.degreesToRadians(radians.x);
    radians.y = TjMath.degreesToRadians(radians.y);
    radians.z = TjMath.degreesToRadians(radians.z);
    this.rotate(radians);
    return this;
  }

  equals(coord: Coordinate3d) {
    return this.x == coord.x && this.y == coord.y && this.z == coord.z;
  }

  manhattanDistance(coord: Coordinate3d) {
    return Math.abs(this.x - coord.x) + Math.abs(this.y - coord.y) + Math.abs(this.z - coord.z);
  }
}
