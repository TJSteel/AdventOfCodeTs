import { Coordinate3d } from '../../core/coordinate3d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { Beacon } from './beacon';
import { Scanner } from './scanner';

class Puzzle extends AbstractPuzzle {
  rootScanner: Scanner = new Scanner(0);
  scanners: Scanner[] = [];
  knownBeacons: Coordinate3d[] = [];
  setAnswers(): void {
    super.setAnswers(79, 483, 3621, 14804);
  }

  parseInput(): void {
    this.scanners = [];
    let id = -1;
    let scanner: Scanner = new Scanner(-1);
    const center = new Coordinate3d(0, 0, 0);
    for (const line of this.input) {
      if (line.includes('scanner')) {
        id++;
        scanner = new Scanner(id);
        this.scanners[id] = scanner;
        continue;
      } else if (line == '') {
        continue;
      }
      const [x, y, z] = line.split(',').map((v: string) => parseInt(v));
      const coord: Coordinate3d = new Coordinate3d(x, y, z);
      scanner.addBeacon(new Beacon(coord));
    }
    this.rootScanner = this.scanners[0];
    this.rootScanner.coord = new Coordinate3d(0, 0, 0);
    this.rootScanner.rotation = 0;
    this.rootScanner.beaconCoords = this.rootScanner.beacons.map((b) => b.coords[0]);
    for (const scanner of this.scanners) {
      scanner.updateBeaconDistances();
    }
  }

  calculateScanners() {
    let resolvedScanners = this.scanners.filter((s) => s.coord !== null && !s.duplicate);
    let unresolvedScanners = this.scanners.filter((s) => s.coord == null);
    let scannersUpdated = true;
    while (scannersUpdated) {
      scannersUpdated = false;
      for (const scanner of unresolvedScanners) {
        for (const resolvedScanner of resolvedScanners) {
          scanner.calculatePosition(resolvedScanner, 12);
          if (scanner.coord !== null) {
            scannersUpdated = true;
          }
        }
      }
      resolvedScanners = this.scanners.filter((s) => s.coord !== null && !s.duplicate);
      unresolvedScanners = this.scanners.filter((s) => s.coord == null);
    }
  }

  calculateAnswer1 = (): number => {
    this.calculateScanners();
    return this.rootScanner.beaconCoords!.length;
  };

  calculateAnswer2 = (): number => {
    this.calculateScanners();
    let answer = 0;
    for (const scannerA of this.scanners) {
      for (const scannerB of this.scanners) {
        const distance = scannerA.coord!.manhattanDistance(scannerB.coord!);
        if (distance > answer) {
          answer = distance;
        }
      }
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2021', '19', PuzzleStatus.INEFFICIENT);
