import { Coordinate3d } from '../../core/coordinate3d';
import { Beacon } from './beacon';

export class Scanner {
  id: number;
  coord: Coordinate3d | null = null;
  rotation: number = -1;
  beacons: Beacon[] = [];
  beaconCoords: Coordinate3d[] | null = null;
  duplicate: boolean = false;

  constructor(id: number) {
    this.id = id;
  }
  addBeacon(beacon: Beacon) {
    this.beacons.push(beacon);
  }

  calculatePosition(scanner: Scanner, minOverlap: number) {
    if (this.rotation > -1) {
      throw new Error(`already calculated scanner ${this.id}`);
    }

    const sCoords = scanner.beaconCoords ? scanner.beaconCoords : scanner.beacons.map((s) => s.coords[0]);
    // try each possible rotation
    for (let rotation = 0; rotation < 24; rotation++) {
      const tCoords = this.beacons.map((t) => t.coords[rotation]);
      // try and use the offset from each beacon in each pair applied to all other pairs
      // if we get a big match of offsets then we have a match

      for (const tCoord of tCoords) {
        for (const sCoord of sCoords) {
          const offset = tCoord.copy().subtract(sCoord);
          const offsetTCoords = tCoords.map((c) => c.copy().subtract(offset));
          const matchingCount = offsetTCoords.filter((t) => sCoords.find((s) => s.equals(t))).length;
          if (matchingCount >= minOverlap) {
            this.rotation = rotation;
            this.coord = offset;
            this.beaconCoords = offsetTCoords;
            for (const newSCoord of sCoords) {
              if (!this.beaconCoords.find((b) => b.equals(newSCoord))) {
                this.beaconCoords.push(newSCoord);
              }
            }

            if (this.id < scanner.id) {
              scanner.duplicate = true;
            } else {
              this.duplicate = true;
              scanner.beaconCoords = this.beaconCoords;
            }
            return;
          }
        }
      }
    }
  }
}
