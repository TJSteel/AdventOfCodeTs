import { tjMath } from './utils';

export class Coordinate3d {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toString(): string {
    return `x: ${this.x}, y: ${this.y}, z: ${this.z}`;
  }

  rotate(xRadians: number, yRadians: number, zRadians: number): void {
    this.rotateX(xRadians);
    this.rotateY(yRadians);
    this.rotateZ(zRadians);
  }
  rotateDegrees(degreesX: number, degreesY: number, degreesZ: number): void {
    const radiansX = tjMath.degreesToRadians(degreesX);
    const radiansY = tjMath.degreesToRadians(degreesY);
    const radiansZ = tjMath.degreesToRadians(degreesZ);
    this.rotate(radiansX, radiansY, radiansZ);
  }

  rotateX(radians: number) {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const y = this.y * cos - this.z * sin;
    const z = this.y * sin + this.z * cos;
    this.y = Math.round(y);
    this.z = Math.round(z);
  }
  rotateXDegrees(degrees: number) {
    const radians = tjMath.degreesToRadians(degrees);
    this.rotateX(radians);
  }

  rotateY(radians: number) {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const x = this.x * cos - this.z * sin;
    const z = this.x * sin + this.z * cos;
    this.x = Math.round(x);
    this.z = Math.round(z);
  }
  rotateYDegrees(degrees: number) {
    const radians = tjMath.degreesToRadians(degrees);
    this.rotateY(radians);
  }

  rotateZ(radians: number) {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const x = this.x * cos - this.y * sin;
    const y = this.x * sin + this.y * cos;
    this.x = Math.round(x);
    this.y = Math.round(y);
  }
  rotateZDegrees(degrees: number) {
    const radians = tjMath.degreesToRadians(degrees);
    this.rotateZ(radians);
  }
}
