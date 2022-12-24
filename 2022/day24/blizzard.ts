import { Coordinate2d } from '../../core/coordinate2d';

export class Blizzard {
  static topLeft: Coordinate2d = new Coordinate2d(0, 0);
  static bottomRight: Coordinate2d;
  coord: Coordinate2d;
  direction: Coordinate2d;
  moveMap: Map<number, Coordinate2d>;
  maxMoves: number;
  constructor(coord: Coordinate2d, direction: Coordinate2d) {
    this.coord = coord;
    this.direction = direction;
    this.moveMap = new Map();
    if (direction.x == 0) {
      this.maxMoves = Blizzard.bottomRight.y + 1;
    } else {
      this.maxMoves = Blizzard.bottomRight.x + 1;
    }
  }
  static inRange(coord: Coordinate2d): boolean {
    return (
      coord.x >= Blizzard.topLeft.x &&
      coord.x <= Blizzard.bottomRight.x &&
      coord.y >= Blizzard.topLeft.y &&
      coord.y <= Blizzard.bottomRight.y
    );
  }
  getPositionAfter(moveCount: number): Coordinate2d {
    const moveMod = moveCount % this.maxMoves;
    if (this.moveMap.has(moveMod)) {
      return this.moveMap.get(moveMod)!;
    }
    const direction = this.direction.copy();
    direction.x *= moveMod;
    direction.y *= moveMod;
    const newCoord = this.coord.copy().add(direction);
    newCoord.x = newCoord.x % (Blizzard.bottomRight.x + 1);
    newCoord.y = newCoord.y % (Blizzard.bottomRight.y + 1);
    while (newCoord.x < 0) {
      newCoord.x += Blizzard.bottomRight.x + 1;
    }
    while (newCoord.y < 0) {
      newCoord.y += Blizzard.bottomRight.y + 1;
    }
    this.moveMap.set(moveMod, newCoord);
    return newCoord;
  }
}
