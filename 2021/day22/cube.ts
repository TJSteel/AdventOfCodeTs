export class Cube {
  on: boolean;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  z1: number;
  z2: number;

  constructor(x1: number, x2: number, y1: number, y2: number, z1: number, z2: number, on: boolean = true) {
    this.on = on;
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.z1 = z1;
    this.z2 = z2;
  }

  /** limits the cube and returns true if it's within bounds */
  limitCube(minMax: Cube): boolean {
    this.x1 = Math.max(minMax.x1, this.x1);
    this.x2 = Math.min(minMax.x2, this.x2);
    this.y1 = Math.max(minMax.y1, this.y1);
    this.y2 = Math.min(minMax.y2, this.y2);
    this.z1 = Math.max(minMax.z1, this.z1);
    this.z2 = Math.min(minMax.z2, this.z2);

    return this.intersects(minMax);
  }

  getArea(): number {
    return (this.x2 - this.x1 + 1) * (this.y2 - this.y1 + 1) * (this.z2 - this.z1 + 1);
  }

  getValue(): number {
    return this.on ? this.getArea() : -this.getArea();
  }

  intersects(cube: Cube): boolean {
    if (
      cube.x1 > this.x2 ||
      cube.x2 < this.x1 ||
      cube.y1 > this.y2 ||
      cube.y2 < this.y1 ||
      cube.z1 > this.z2 ||
      cube.z2 < this.z1
    ) {
      return false;
    }
    return true;
  }

  intersection(cube: Cube): null | Cube {
    if (!this.intersects(cube)) {
      return null;
    }
    return new Cube(
      Math.max(this.x1, cube.x1),
      Math.min(this.x2, cube.x2),
      Math.max(this.y1, cube.y1),
      Math.min(this.y2, cube.y2),
      Math.max(this.z1, cube.z1),
      Math.min(this.z2, cube.z2)
    );
  }
}
