import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

const rotations = [new Coordinate2d(1, 0), new Coordinate2d(0, 1), new Coordinate2d(-1, 0), new Coordinate2d(0, -1)];

interface Translation {
  toCoord: Coordinate2d;
  rotation: Coordinate2d;
}

interface Range {
  start: number;
  end: number;
}

class Puzzle extends AbstractPuzzle {
  instructions: string[] = [];
  map: Array2d<string> = new Array2d();
  rowRanges: Range[] = [];
  columnRanges: Range[] = [];
  coord: Coordinate2d = new Coordinate2d(0, 0);
  rotation: Coordinate2d = new Coordinate2d(1, 0);

  setAnswers(): void {
    super.setAnswers(6032, 181128, 5031, 52311);
  }

  parseInput(): void {
    this.instructions = [];
    let moveString = this.input.pop();
    this.input.pop(); // remove space
    moveString = moveString.replace(/R/g, ',R,');
    moveString = moveString.replace(/L/g, ',L,');
    moveString = moveString.replace(/,,/g, ',');
    this.instructions = moveString.split(',');

    this.input = this.input.map((v) => v.split(''));

    this.map = new Array2d({
      width: Math.max(...this.input.map((v: string) => v.length)),
      height: this.input.length,
      defaultValue: ' ',
    });

    this.rowRanges = [];
    for (let y = 0; y < this.map.getHeight(); y++) {
      let start = -1;
      let end = 0;
      for (let x = 0; x < this.map.getWidth(); x++) {
        const value = this.input[y][x];
        if (value) {
          this.map.setCell(new Coordinate2d(x, y), value);
        }
        if (start == -1) {
          if (value != ' ' && value) {
            start = x;
          }
        }
        if (value != ' ' && value) {
          end = x;
        }
      }
      this.rowRanges.push({ start, end });
    }
    this.columnRanges = [];
    for (let x = 0; x < this.map.getWidth(); x++) {
      let start = -1;
      let end = 0;
      for (let y = 0; y < this.map.getHeight(); y++) {
        const value = this.map.getCell(new Coordinate2d(x, y));
        if (start == -1) {
          if (value != ' ') {
            start = y;
          }
        }
        if (value != ' ') {
          end = y;
        }
      }
      this.columnRanges.push({ start, end });
    }

    this.coord.y = 0;
    this.coord.x = this.rowRanges[0].start;

    this.rotation = new Coordinate2d(1, 0);
  }

  static getTranslationString(coord: Coordinate2d, rotation: Coordinate2d) {
    return `${coord.toString()}${rotation.toString()}`;
  }

  calculatePath(translations: Map<string, Translation>): number {
    for (const instruction of this.instructions) {
      const int = parseInt(instruction);
      if (!isNaN(int)) {
        // move
        for (let i = 0; i < int; i++) {
          const columnRange = this.columnRanges[this.coord.x];
          const rowRange = this.rowRanges[this.coord.y];
          let newCoord = this.coord.copy().add(this.rotation);

          const translation = translations.get(Puzzle.getTranslationString(this.coord, this.rotation));
          if (translation) {
            newCoord = translation.toCoord.copy();
          } else {
            if (this.rotation.x == 0) {
              // moving up/down
              if (newCoord.y < columnRange.start) {
                newCoord.y = columnRange.end;
              }
              if (newCoord.y > columnRange.end) {
                newCoord.y = columnRange.start;
              }
            } else {
              // moving left/right
              if (newCoord.x < rowRange.start) {
                newCoord.x = rowRange.end;
              }
              if (newCoord.x > rowRange.end) {
                newCoord.x = rowRange.start;
              }
            }
          }
          const newCell = this.map.getCell(newCoord);
          if (newCell == '#') {
            break;
          }
          this.coord = newCoord;
          if (translation) {
            this.rotation = translation.rotation.copy();
          }
        }
      } else {
        // rotate
        switch (instruction) {
          case 'R':
            this.rotation.rotateDegrees(90);
            break;
          case 'L':
            this.rotation.rotateDegrees(270);
            break;
          default:
            console.log(`shouldn't have a rotation ${instruction}`);
        }
      }
    }

    const row = this.coord.y + 1;
    const col = this.coord.x + 1;
    const rot = rotations.findIndex((r) => r.equals(this.rotation));

    return 1000 * row + 4 * col + rot;
  }

  static addTranslations = (
    translations: Map<string, Translation>,
    length: number,
    fromCoord: Coordinate2d,
    fromDirection: Coordinate2d,
    toCoord: Coordinate2d,
    toDirection: Coordinate2d,
    fromRotation: Coordinate2d,
    toRotation: Coordinate2d
  ): void => {
    const rotationReverse = toRotation.copy();
    rotationReverse.rotateDegrees(180);
    const newRotationReverse = fromRotation.copy();
    newRotationReverse.rotateDegrees(180);
    while (length-- > 0) {
      const translationString = Puzzle.getTranslationString(fromCoord, fromRotation);
      translations.set(translationString, {
        toCoord,
        rotation: toRotation,
      });

      const translationStringReverse = Puzzle.getTranslationString(toCoord, rotationReverse);
      translations.set(translationStringReverse, {
        toCoord: fromCoord,
        rotation: newRotationReverse,
      });
      fromCoord = fromCoord.copy().add(fromDirection);
      toCoord = toCoord.copy().add(toDirection);
    }
  };

  calculateAnswer1 = (): number => {
    return this.calculatePath(new Map());
  };

  calculateAnswer2 = (): number => {
    const translations: Map<string, Translation> = new Map();

    if (this.isTest) {
      const boxWidth = 4;
      Puzzle.addTranslations(
        translations,
        boxWidth,
        new Coordinate2d(4, 4),
        new Coordinate2d(1, 0),
        new Coordinate2d(8, 0),
        new Coordinate2d(0, 1),
        new Coordinate2d(0, -1),
        new Coordinate2d(1, 0)
      );

      Puzzle.addTranslations(
        translations,
        boxWidth,
        new Coordinate2d(11, 4),
        new Coordinate2d(0, 1),
        new Coordinate2d(15, 8),
        new Coordinate2d(-1, 0),
        new Coordinate2d(1, 0),
        new Coordinate2d(0, 1)
      );

      Puzzle.addTranslations(
        translations,
        boxWidth,
        new Coordinate2d(8, 11),
        new Coordinate2d(1, 0),
        new Coordinate2d(3, 7),
        new Coordinate2d(-1, 0),
        new Coordinate2d(0, 1),
        new Coordinate2d(0, -1)
      );
    } else {
      // 1
      const boxWidth = 50;
      Puzzle.addTranslations(
        translations,
        boxWidth,
        new Coordinate2d(50, 0),
        new Coordinate2d(1, 0),
        new Coordinate2d(0, 150),
        new Coordinate2d(0, 1),
        new Coordinate2d(0, -1),
        new Coordinate2d(1, 0)
      );

      // 2
      Puzzle.addTranslations(
        translations,
        boxWidth,
        new Coordinate2d(0, 100),
        new Coordinate2d(1, 0),
        new Coordinate2d(50, 50),
        new Coordinate2d(0, 1),
        new Coordinate2d(0, -1),
        new Coordinate2d(1, 0)
      );

      // 3
      Puzzle.addTranslations(
        translations,
        boxWidth,
        new Coordinate2d(100, 49),
        new Coordinate2d(1, 0),
        new Coordinate2d(99, 50),
        new Coordinate2d(0, 1),
        new Coordinate2d(0, 1),
        new Coordinate2d(-1, 0)
      );

      // 4
      Puzzle.addTranslations(
        translations,
        boxWidth,
        new Coordinate2d(100, 0),
        new Coordinate2d(1, 0),
        new Coordinate2d(0, 199),
        new Coordinate2d(1, 0),
        new Coordinate2d(0, -1),
        new Coordinate2d(0, -1)
      );

      // 5
      Puzzle.addTranslations(
        translations,
        boxWidth,
        new Coordinate2d(149, 0),
        new Coordinate2d(0, 1),
        new Coordinate2d(99, 149),
        new Coordinate2d(0, -1),
        new Coordinate2d(1, 0),
        new Coordinate2d(-1, 0)
      );

      // 6
      Puzzle.addTranslations(
        translations,
        boxWidth,
        new Coordinate2d(49, 150),
        new Coordinate2d(0, 1),
        new Coordinate2d(50, 149),
        new Coordinate2d(1, 0),
        new Coordinate2d(1, 0),
        new Coordinate2d(0, -1)
      );

      // 7
      Puzzle.addTranslations(
        translations,
        boxWidth,
        new Coordinate2d(50, 0),
        new Coordinate2d(0, 1),
        new Coordinate2d(0, 149),
        new Coordinate2d(0, -1),
        new Coordinate2d(-1, 0),
        new Coordinate2d(1, 0)
      );
    }

    return this.calculatePath(translations);
  };
}

export const puzzle = new Puzzle('2022', '22', PuzzleStatus.COMPLETE);
