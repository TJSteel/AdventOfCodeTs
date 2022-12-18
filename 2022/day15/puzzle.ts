import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Sensor {
  coord: Coordinate2d;
  closestBeacon: Coordinate2d;
  distance: number;
  constructor(coord: Coordinate2d, closestBeacon: Coordinate2d) {
    this.coord = coord;
    this.closestBeacon = closestBeacon;
    this.distance = this.coord.manhattanDistance(this.closestBeacon);
  }
}

class Puzzle extends AbstractPuzzle {
  beacons: Coordinate2d[] = [];
  sensors: Sensor[] = [];
  min = new Coordinate2d(Infinity, Infinity);
  max = new Coordinate2d(-Infinity, -Infinity);

  setAnswers(): void {
    super.setAnswers(26, 4793062, 56000011, 10826395253551);
  }

  parseInput(): void {
    this.beacons = [];
    this.sensors = [];

    this.input = this.input.map((v: string) => {
      v = v.replace('Sensor at', '');
      v = v.replace(/ x=/g, '');
      v = v.replace(/ y=/g, '');
      v = v.replace(' closest beacon is at', '');
      const coords = v.split(':');
      const sensorParts = coords[0].split(',').map((v) => parseInt(v));
      const beaconParts = coords[1].split(',').map((v) => parseInt(v));
      const sensorCoord = new Coordinate2d(sensorParts[0], sensorParts[1]);
      let beacon = new Coordinate2d(beaconParts[0], beaconParts[1]);
      const beaconInArr = this.beacons.find((b) => b.equals(beacon));
      if (beaconInArr) {
        beacon = beaconInArr;
      } else {
        this.beacons.push(beacon);
      }
      this.sensors.push(new Sensor(sensorCoord, beacon));
    });
  }

  getMinMaxCoords() {
    for (const coord of [...this.sensors.map((v) => v.coord), ...this.beacons]) {
      this.min.x = Math.min(this.min.x, coord.x);
      this.min.y = Math.min(this.min.y, coord.y);
      this.max.x = Math.max(this.max.x, coord.x);
      this.max.y = Math.max(this.max.y, coord.y);
    }
  }

  countWhereSensorIsNot(from: Coordinate2d, to: Coordinate2d): number {
    let count = 0;
    const signalBeaconCoords = [...this.beacons, ...this.sensors.map((v) => v.coord)];
    for (let x = from.x; x <= to.x; x++) {
      for (let y = from.y; y <= to.y; y++) {
        const coord = new Coordinate2d(x, y);
        if (this.sensors.find((s) => s.coord.equals(coord)) || this.beacons.find((b) => b.equals(coord))) {
          continue;
        }

        for (const sensor of this.sensors) {
          const distance = sensor.coord.manhattanDistance(coord);
          if (distance <= sensor.distance) {
            const yDistance = Math.abs(sensor.coord.y - y);
            const rightX = sensor.distance - yDistance;
            const lastX = sensor.coord.x + rightX;
            count += lastX - x + 1;
            const signalBeaconCount = signalBeaconCoords.filter((v) => v.y == y && v.x >= x && v.x <= lastX).length;
            count -= signalBeaconCount;
            x = lastX;
            x = lastX;
            break;
          }
        }
      }
    }
    return count;
  }

  findWhereSensorIs(from: Coordinate2d, to: Coordinate2d): Coordinate2d | null {
    for (let y = from.y; y <= to.y; y++) {
      for (let x = from.x; x <= to.x; x++) {
        const coord = new Coordinate2d(x, y);

        let cantBe = false;
        for (const sensor of this.sensors) {
          const distance = sensor.coord.manhattanDistance(coord);
          if (distance <= sensor.distance) {
            cantBe = true;
            const yDistance = Math.abs(sensor.coord.y - y);
            const rightX = sensor.distance - yDistance;
            x = sensor.coord.x + rightX;
            break;
          }
        }
        if (!cantBe) {
          return coord;
        }
      }
    }
    return null;
  }

  calculateAnswer1 = (): number => {
    this.getMinMaxCoords();
    const y = this.isTest ? 10 : 2000000;
    this.sensors.sort((a, b) => b.distance - a.distance);
    const margin = Math.round(this.sensors[0].distance / 2);
    const from = new Coordinate2d(this.min.x - margin, y);
    const to = new Coordinate2d(this.max.x + margin, y);
    const answer = this.countWhereSensorIsNot(from, to);

    return answer;
  };

  calculateAnswer2 = (): number => {
    this.getMinMaxCoords();
    const from = new Coordinate2d(0, 0);
    const to = this.isTest ? new Coordinate2d(20, 20) : new Coordinate2d(4000000, 4000000);

    const coord = this.findWhereSensorIs(from, to);
    if (!coord) {
      throw new Error('Signal not found');
    }
    return coord.x * 4000000 + coord.y;
  };
}

export const puzzle = new Puzzle('2022', '15', PuzzleStatus.COMPLETE);
