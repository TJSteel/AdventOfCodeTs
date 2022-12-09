import { Coordinate3d } from '../../core/coordinate3d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

interface BeaconHash {
  distance: number;
  beacons: Beacon[];
}

class Coordinate extends Coordinate3d {
  constructor(
    x: number,
    y: number,
    z: number,
    rotationDegreesX: number = 0,
    rotationDegreesY: number = 0,
    rotationDegreesZ: number = 0
  ) {
    super(x, y, z);
    this.rotateDegrees(rotationDegreesX, rotationDegreesY, rotationDegreesZ);
  }
  getDistance(coordinate: Coordinate): number {
    return Math.abs(this.x - coordinate.x) + Math.abs(this.y - coordinate.y) + Math.abs(this.z - coordinate.z);
  }
}

class Beacon {
  static count = 0;
  coordinate: Coordinate;
  id: number = 0;
  permutations: Coordinate[];
  constructor(x: number, y: number, z: number) {
    this.coordinate = new Coordinate(x, y, z);
    this.id = Beacon.count;
    Beacon.count++;
    this.permutations = [];
    const permutationMatrix = [
      [0, 0, 0],
      [90, 0, 0],
      [180, 0, 0],
      [270, 0, 0],
      [0, 0, 90],
      [90, 0, 90],
      [180, 0, 90],
      [270, 0, 90],
      [0, 0, 180],
      [90, 0, 180],
      [180, 0, 180],
      [270, 0, 180],
      [0, 0, 270],
      [90, 0, 270],
      [180, 0, 270],
      [270, 0, 270],
      [0, 90, 0],
      [90, 90, 0],
      [180, 90, 0],
      [270, 90, 0],
      [0, 270, 0],
      [90, 270, 0],
      [180, 270, 0],
      [270, 270, 0],
    ];
    for (const permutation of permutationMatrix) {
      this.permutations.push(new Coordinate(x, y, z, permutation[0], permutation[1], permutation[2]));
    }
  }
}

class Scanner {
  calculateOffset(solvedScanner: Scanner) {
    /*
    filter to only the overlapping hashes
    find the highest and lowest x,y,z and calculate the difference
    based on this we should be able to calculate the x,y,z mapping
    finally work out the x,y,z flip (-/+)
    */
    throw new Error('calculateOffset not implemented.');
  }
  id: number;
  beacons: Beacon[] = [];
  hashes: BeaconHash[] = [];
  solved: boolean = false;
  constructor(id: number) {
    this.id = id;
  }
  addBeacon(locations: number[]) {
    if (
      !this.beacons.find(
        (b) => b.coordinate.x === locations[0] && b.coordinate.y === locations[1] && b.coordinate.z === locations[2]
      )
    ) {
      this.beacons.push(new Beacon(locations[0], locations[1], locations[2]));
    }
  }
  calculateDistances() {
    const len = this.beacons.length;
    for (let a = 0; a < len; a++) {
      for (let b = a + 1; b < len; b++) {
        const beaconA = this.beacons[a];
        const beaconB = this.beacons[b];
        this.hashes.push({ distance: beaconA.coordinate.getDistance(beaconB.coordinate), beacons: [beaconA, beaconB] });
      }
    }
  }
  getOverlapCount(hashes: BeaconHash[]): number {
    let count = 0;
    for (const hash of this.hashes) {
      count += hashes.filter((h) => h.distance === hash.distance).length;
    }
    return count;
  }
}

class Puzzle extends AbstractPuzzle {
  scanners: Scanner[] = [];

  setAnswers(): void {
    super.setAnswers(0, -1, -1, -1);
  }

  parseInput(): void {
    this.input = this.input.filter((v) => v);
    let scanner: Scanner;
    this.input.forEach((line) => {
      if (line.includes('scanner')) {
        const scannerId = parseInt(line.split(' ')[2]);
        scanner = new Scanner(scannerId);
        this.scanners.push(scanner);
      } else {
        let locations = line.split(',').map((v: string) => parseInt(v));
        scanner.addBeacon(locations);
      }
    });
    for (const s of this.scanners) {
      s.calculateDistances();
    }
  }

  calculateAnswer1 = (): number => {
    let solvedCount = 0;
    const scannerCount = this.scanners.length;
    this.scanners[0].solved = true;
    while (solvedCount < scannerCount) {
      for (const solvedScanner of this.scanners.filter((s) => s.solved)) {
        // if solved, compare all unsolved against this scanner;
        for (const scanner of this.scanners.filter((s) => !s.solved)) {
          const overlapCount = solvedScanner.getOverlapCount(scanner.hashes);
          // if we can match 66 connections we have an overlap of at least 12 nodes
          if (overlapCount >= 66) {
            scanner.calculateOffset(solvedScanner);

            break;
          }
        }
      }
    }

    return this.input[0] + this.input[1];
  };

  calculateAnswer2 = (): number => {
    return this.input[0] * this.input[1];
  };
}

export const puzzle = new Puzzle('2021', '19', PuzzleStatus.NOT_SOLVED);
