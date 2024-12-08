import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  map: Array2d<string> = new Array2d();
  antennaGroups: Map<string, Coordinate2d[]> = new Map();
  antiNodes: Set<string> = new Set();

  setAnswers(): void {
    super.setAnswers(14, 240, 34, 955);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split(''));
    this.map = new Array2d({ data: this.input });
    this.antennaGroups = new Map();
    for (const cell of this.map) {
      if (cell.value != '.') {
        if (!this.antennaGroups.has(cell.value)) {
          this.antennaGroups.set(cell.value, []);
        }
        const antennaGroup: Coordinate2d[] = this.antennaGroups.get(cell.value)!;
        antennaGroup.push(cell.coord);
      }
    }
    this.antiNodes = new Set();
  }

  calculateAnswer1 = (): number => {
    for (const coords of this.antennaGroups.values()) {
      for (let a = 0; a < coords.length - 1; a++) {
        for (let b = a + 1; b < coords.length - 0; b++) {
          const offset = coords[b].copy().subtract(coords[a]);
          const antiNodes = [coords[a].copy().subtract(offset), coords[b].copy().add(offset)];
          for (const antiNode of antiNodes) {
            if (this.map.inRange(antiNode)) {
              this.antiNodes.add(antiNode.toString());
              this.map.setCell(antiNode, '#');
            }
          }
        }
      }
    }
    return this.antiNodes.size;
  };

  calculateAnswer2 = (): number => {
    for (const coords of this.antennaGroups.values()) {
      for (let a = 0; a < coords.length - 1; a++) {
        this.antiNodes.add(coords[a].toString());
        for (let b = a + 1; b < coords.length - 0; b++) {
          this.antiNodes.add(coords[b].toString());
          const offset = coords[b].copy().subtract(coords[a]);
          const antiNodes: Coordinate2d[] = [];

          // keep subtracting the offset from a until out of range
          let aOffset = coords[a].copy().subtract(offset);
          while (this.map.inRange(aOffset)) {
            antiNodes.push(aOffset);
            aOffset = aOffset.copy().subtract(offset);
          }

          // keep adding the offset to b until out of range
          let bOffset = coords[b].copy().add(offset);
          while (this.map.inRange(bOffset)) {
            antiNodes.push(bOffset);
            bOffset = bOffset.copy().add(offset);
          }

          for (const antiNode of antiNodes) {
            this.antiNodes.add(antiNode.toString());
            this.map.setCell(antiNode, '#');
          }
        }
      }
    }
    return this.antiNodes.size;
  };
}

export const puzzle = new Puzzle('2024', '08', PuzzleStatus.COMPLETE);
