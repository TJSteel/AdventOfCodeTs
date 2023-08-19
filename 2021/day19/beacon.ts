import { Coordinate3d } from '../../core/coordinate3d';

const rotationMatrix = [
  new Coordinate3d(0, 0, 0),
  new Coordinate3d(0, 0, 90),
  new Coordinate3d(0, 0, 180),
  new Coordinate3d(0, 0, 270),

  new Coordinate3d(0, 90, 0),
  new Coordinate3d(0, 90, 90),
  new Coordinate3d(0, 90, 180),
  new Coordinate3d(0, 90, 270),

  new Coordinate3d(0, 180, 0),
  new Coordinate3d(0, 180, 90),
  new Coordinate3d(0, 180, 180),
  new Coordinate3d(0, 180, 270),

  new Coordinate3d(0, 270, 0),
  new Coordinate3d(0, 270, 90),
  new Coordinate3d(0, 270, 180),
  new Coordinate3d(0, 270, 270),

  new Coordinate3d(90, 0, 0),
  new Coordinate3d(90, 0, 90),
  new Coordinate3d(90, 0, 180),
  new Coordinate3d(90, 0, 270),

  new Coordinate3d(270, 0, 0),
  new Coordinate3d(270, 0, 90),
  new Coordinate3d(270, 0, 180),
  new Coordinate3d(270, 0, 270),
];

export class Beacon {
  coords: Coordinate3d[] = [];

  constructor(coord: Coordinate3d) {
    for (const rotation of rotationMatrix) {
      this.coords.push(coord.copy().rotateDegrees(rotation));
    }
  }
}
