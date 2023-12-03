import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

interface Part {
  str: string;
  value: number;
  isPartNumber: boolean;
  gearCoord?: Coordinate2d;
}

interface Gear {
  coord: Coordinate2d;
  parts: Part[];
}

class Puzzle extends AbstractPuzzle {
  map: Array2d = new Array2d();

  setAnswers(): void {
    super.setAnswers(4361, 537732, 467835, 84883664);
  }

  parseInput(): void {
    this.input = this.input.map((v) => v.split(''));
    this.map = new Array2d({
      data: this.input,
    });
  }

  calculateAnswer1 = (): number => {
    const parts: Part[] = [];

    let currentPart: Part = {
      str: '',
      value: 0,
      isPartNumber: false,
    };

    for (let c = 0; c < this.map.getWidth(); c++) {
      for (let r = 0; r < this.map.getHeight(); r++) {
        const coord = new Coordinate2d(r, c);
        const value = parseInt(this.map.getCell(coord));
        if (isNaN(value)) {
          if (currentPart.isPartNumber) {
            parts.push(currentPart);
          }
          currentPart = {
            str: '',
            value: 0,
            isPartNumber: false,
          };
        } else {
          currentPart.str += value;
          currentPart.value = parseInt(currentPart.str);

          if (!currentPart.isPartNumber) {
            for (const neighbourCoord of this.map.getNeighbours(coord)) {
              const neighbour = this.map.getCell(neighbourCoord);
              if (neighbour !== '.' && isNaN(parseInt(neighbour))) {
                currentPart.isPartNumber = true;
                break;
              }
            }
          }
        }
      }

      if (currentPart.isPartNumber) {
        parts.push(currentPart);
      }
      currentPart = {
        str: '',
        value: 0,
        isPartNumber: false,
      };
    }

    return parts.map((v) => v.value).reduce((a, b) => a + b, 0);
  };

  calculateAnswer2 = (): number => {
    let answer = 0;

    const parts: Part[] = [];

    let currentPart: Part = {
      str: '',
      value: 0,
      isPartNumber: false,
    };

    for (let c = 0; c < this.map.getWidth(); c++) {
      for (let r = 0; r < this.map.getHeight(); r++) {
        const coord = new Coordinate2d(r, c);
        const value = parseInt(this.map.getCell(coord));
        if (isNaN(value)) {
          if (currentPart.isPartNumber) {
            parts.push(currentPart);
          }
          currentPart = {
            str: '',
            value: 0,
            isPartNumber: false,
          };
        } else {
          currentPart.str += value;
          currentPart.value = parseInt(currentPart.str);

          if (!currentPart.isPartNumber) {
            for (const neighbourCoord of this.map.getNeighbours(coord)) {
              const neighbour = this.map.getCell(neighbourCoord);
              if (neighbour === '*') {
                currentPart.isPartNumber = true;
                currentPart.gearCoord = neighbourCoord;
              }
            }
          }
        }
      }

      if (currentPart.isPartNumber) {
        parts.push(currentPart);
      }
      currentPart = {
        str: '',
        value: 0,
        isPartNumber: false,
      };
    }

    // loop all parts and build the gear array
    const gears: Gear[] = [];
    for (const part of parts) {
      if (part.gearCoord) {
        let gear: Gear | undefined = gears.find((g) => g.coord.equals(part.gearCoord!));
        if (!gear) {
          gear = { coord: part.gearCoord, parts: [] };
          gears.push(gear);
        }
        gear.parts.push(part);
      }
    }

    // loop all gears and those with 2 we add to the answer
    for (const gear of gears.filter((g) => g.parts.length == 2)) {
      answer += gear.parts[0].value * gear.parts[1].value;
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2023', '03', PuzzleStatus.COMPLETE);
