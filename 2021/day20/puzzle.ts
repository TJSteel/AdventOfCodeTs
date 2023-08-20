import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

const matrix = [
  new Coordinate2d(-1, -1),
  new Coordinate2d(0, -1),
  new Coordinate2d(1, -1),
  new Coordinate2d(-1, 0),
  new Coordinate2d(0, 0),
  new Coordinate2d(1, 0),
  new Coordinate2d(-1, 1),
  new Coordinate2d(0, 1),
  new Coordinate2d(1, 1),
];

class Puzzle extends AbstractPuzzle {
  enhancementAlgorithm: string = '';
  image: Array2d = new Array2d();
  border: string = '0';

  setAnswers(): void {
    super.setAnswers(35, 5483, 3351, 18732, { highAnswers: { main2: [19661] }, lowAnswers: { main2: [5097] } });
  }

  parseInput(): void {
    this.enhancementAlgorithm = this.input
      .shift()
      .split('')
      .map((s: string) => (s == '#' ? '1' : '0'));
    this.input.shift();
    const data = this.input.map((s) => s.split('').map((s: string) => (s == '#' ? '1' : '0')));
    this.image = new Array2d({ data });
  }

  addImagePadding(image: Array2d) {
    for (let i = 0; i < 4; i++) {
      const width = image.getWidth();
      image.addRow(`${this.border}`.repeat(width).split(''));
      image.rotateClockwise();
    }
  }

  enhanceImage(image: Array2d): Array2d {
    this.addImagePadding(this.image);
    const newImage: Array2d = image.copy();
    for (const img of newImage) {
      const coord = img.coord;
      let binaryString = '';
      for (const offset of matrix) {
        let value = image.getCell(coord.copy().add(offset));
        if (value == null) {
          value = this.border;
        }
        binaryString += value;
      }
      const binary = parseInt(binaryString, 2);
      newImage.setCell(img.coord, this.enhancementAlgorithm[binary]);
    }
    this.border = newImage.getCell(new Coordinate2d(0, 0));
    return newImage;
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    for (let i = 0; i < 2; i++) {
      this.image = this.enhanceImage(this.image);
    }
    for (const img of this.image) {
      if (img.value == 1) {
        answer++;
      }
    }
    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    for (let i = 0; i < 50; i++) {
      this.image = this.enhanceImage(this.image);
    }
    for (const img of this.image) {
      if (img.value == 1) {
        answer++;
      }
    }
    return answer;
  };
}

export const puzzle = new Puzzle('2021', '20', PuzzleStatus.COMPLETE);
