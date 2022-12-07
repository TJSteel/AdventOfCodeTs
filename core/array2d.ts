import { Coordinate2d } from './coordinate2d';
import { logger } from './utils';

export class Array2d {
  public data: Array<any[]>;

  private height: number;
  private width: number;
  private defaultValue: any;
  static neighboursAdjacent = [
    new Coordinate2d(0, -1),
    new Coordinate2d(-1, 0),
    new Coordinate2d(1, 0),
    new Coordinate2d(0, 1),
  ];
  static neighboursDiagonal = [
    new Coordinate2d(-1, -1),
    new Coordinate2d(1, -1),
    new Coordinate2d(-1, 1),
    new Coordinate2d(1, 1),
  ];
  static neighbours = [...Array2d.neighboursAdjacent, ...Array2d.neighboursDiagonal];

  constructor(settings?: { width?: number; height?: number; defaultValue?: any; data?: [][] }) {
    this.width = settings?.width ? settings?.width : 0;
    this.height = settings?.height ? settings?.height : 0;
    this.defaultValue = settings?.defaultValue !== null ? settings?.defaultValue : null;

    this.data = [];
    for (let y = 0; y < this.height; y++) {
      this.data.push([]);
      for (let x = 0; x < this.width; x++) {
        this.data[y][x] = settings?.data ? settings.data[y][x] : JSON.parse(JSON.stringify(this.defaultValue));
      }
    }
  }

  [Symbol.iterator]() {
    let x = 0;
    let y = 0;
    return {
      next: () => {
        if (x == this.width) {
          x = 0;
          y++;
        }
        let done = y == this.height;
        return {
          done,
          value: done
            ? undefined
            : {
                coord: new Coordinate2d(x, y),
                value: this.data[y][x++],
              },
        };
      },
      return: () => {
        return { value: undefined, done: true };
      },
    };
  }
  public toString = () => {
    return this.data.map((d) => d.join('')).join(`\n`);
  };

  public print(delimiter: string = ''): void {
    logger.log('');
    for (let y = 0; y < this.height; y++) {
      logger.log(this.data[y].join(delimiter));
    }
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public addRow(row: any[]): void {
    let rowLength = row.length;
    if (rowLength !== this.width) {
      throw new Error(
        `addRow failed because the row length '${rowLength}' is not equal to the Array2d width '${this.width}'`
      );
    } else {
      this.data.push(row);
      this.height++;
    }
  }

  public inRangeX(x: number): boolean {
    return x >= 0 && x < this.width;
  }

  public inRangeY(y: number): boolean {
    return y >= 0 && y < this.height;
  }

  public inRange(coord: Coordinate2d): boolean {
    return this.inRangeX(coord.x) && this.inRangeY(coord.y);
  }

  public getCell(coord: Coordinate2d): any {
    if (this.inRange(coord)) {
      return this.data[coord.y][coord.x];
    } else {
      return null;
    }
  }

  public setCell(coord: Coordinate2d, value: any): void {
    if (this.inRange(coord)) {
      this.data[coord.y][coord.x] = value;
    } else {
      throw new Error(`${coord} is out of range, the current range is x: 0-${this.width}, y: 0-${this.height}`);
    }
  }

  public setWidth(w: number): void {
    let change = this.width - w;
    this.width = w;
    for (let y = 0; y < this.height; y++) {
      for (let c = 0; c < change; c++) {
        this.data[y].pop();
      }
    }
  }

  public setHeight(height: number): void {
    let change = this.height - height;
    this.height = height;
    for (let c = 0; c < change; c++) {
      this.data.pop();
    }
  }

  private _getNeighbours(coord: Coordinate2d, neighbourGroup: Array<Coordinate2d>): Array<Coordinate2d> {
    let neighbours: Array<Coordinate2d> = [];
    neighbourGroup.forEach((n) => {
      let nCoord: Coordinate2d = new Coordinate2d(coord.x + n.x, coord.y + n.y);
      if (this.getCell(nCoord) !== null) {
        neighbours.push(nCoord);
      }
    });
    return neighbours;
  }

  public getNeighbours(coord: Coordinate2d): Array<Coordinate2d> {
    return this._getNeighbours(coord, Array2d.neighbours);
  }

  public getNeighboursAdjacent(coord: Coordinate2d): Array<Coordinate2d> {
    return this._getNeighbours(coord, Array2d.neighboursAdjacent);
  }

  public getNeighboursDiagonal(coord: Coordinate2d): Array<Coordinate2d> {
    return this._getNeighbours(coord, Array2d.neighboursDiagonal);
  }

  public flipArrayX() {
    this.data.map((d) => d.reverse());
  }

  public flipArrayY() {
    this.data.reverse();
  }

  private _rotate(clockwise: boolean): void {
    let w = this.width;
    let h = this.height;
    this.height = w;
    this.width = h;

    let data: any[] = [];
    for (let x = 0; x < w; x++) {
      data[x] = [];
    }
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (clockwise) {
          data[x][h - 1 - y] = this.data[y][x];
        } else {
          data[w - 1 - x][y] = this.data[y][x];
        }
      }
    }
    this.data = data;
  }

  public rotateClockwise() {
    this._rotate(true);
  }

  public rotateAntiClockwise() {
    this._rotate(false);
  }

  private _foldX(value: number) {
    for (let y = 0; y < this.height; y++) {
      for (let x = value + 1, xO = 2; x < this.width; x++, xO += 2) {
        let cell = this.data[y][x];
        if (cell !== this.defaultValue) {
          this.data[y][x - xO] = cell;
        }
      }
    }
    this.setWidth(value);
  }

  private _foldY(value: number) {
    for (let y = value + 1, yO = 2; y < this.height; y++, yO += 2) {
      for (let x = 0; x < this.width; x++) {
        let cell = this.data[y][x];
        if (cell !== this.defaultValue) {
          this.data[y - yO][x] = cell;
        }
      }
    }
    this.setHeight(value);
  }

  public fold(direction: string, value: number) {
    if (direction === 'x' && this.inRangeX(value)) {
      this._foldX(value);
    } else if (direction === 'y' && this.inRangeY(value)) {
      this._foldY(value);
    }
  }

  public copy(): Array2d {
    return new Array2d({
      width: this.width,
      height: this.height,
      defaultValue: this.defaultValue,
      data: JSON.parse(JSON.stringify(this.data)),
    });
  }
}
