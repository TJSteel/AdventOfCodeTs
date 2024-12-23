import { Coordinate2d } from './coordinate2d';
import { Logger } from './utils/logger';

export class Array2d<T> {
  public data: Array<T[]>;

  private height: number;
  private width: number;
  private defaultValue: T | null | undefined;
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

  constructor(settings?: { width?: number; height?: number; defaultValue?: T | null; data?: [][] }) {
    this.width = settings?.width ? settings?.width : 0;
    this.height = settings?.height ? settings?.height : 0;
    this.defaultValue = settings?.defaultValue !== null ? settings?.defaultValue : null;

    if (settings?.data) {
      this.width = settings.data[0].length;
      this.height = settings.data.length;
    }

    this.data = [];
    for (let y = 0; y < this.height; y++) {
      this.data.push([]);
      for (let x = 0; x < this.width; x++) {
        this.data[y][x] = settings?.data ? settings.data[y][x] : JSON.parse(JSON.stringify(this.defaultValue));
      }
    }
  }

  [Symbol.iterator](): { next(): { done: boolean; value: { coord: Coordinate2d; value: T } } } {
    let x = 0;
    let y = 0;
    return {
      next: () => {
        if (x == this.width) {
          x = 0;
          y++;
        }
        if (y == this.height) {
          return {
            done: true,
            value: {
              coord: new Coordinate2d(0, 0),
              value: this.data[0][0],
            },
          };
        }
        return {
          done: false,
          value: {
            coord: new Coordinate2d(x, y),
            value: this.data[y][x++],
          },
        };
      },
    };
  }
  public toString = () => {
    return this.data.map((d) => d.join('')).join(`\n`);
  };

  public print(delimiter: string = ''): void {
    Logger.log('');
    for (let y = 0; y < this.height; y++) {
      Logger.log(this.data[y].join(delimiter));
    }
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public addRow(row: any[], index?: number): void {
    let rowLength = row.length;
    if (rowLength !== this.width) {
      throw new Error(
        `addRow failed because the row length '${rowLength}' is not equal to the Array2d width '${this.width}'`
      );
    }
    if (index === undefined) {
      index = this.height;
    }
    this.data.splice(index, 0, row);
    this.height++;
  }

  public addColumn(column: any[], index?: number): void {
    if (index === undefined) {
      index = this.width;
    }
    let columnLength = column.length;
    if (columnLength !== this.height) {
      throw new Error(
        `addColumn failed because the column length '${columnLength}' is not equal to the Array2d height '${this.height}'`
      );
    }
    this.width++;
    for (let x = this.width - 1; x > index; x--) {
      for (let y = 0; y < this.height; y++) {
        this.data[y][x] = this.data[y][x - 1];
      }
    }
    for (let y = 0; y < this.height; y++) {
      this.data[y][index] = column[y];
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

  public getCell(coord: Coordinate2d): T | null {
    if (this.inRange(coord)) {
      return this.data[coord.y][coord.x];
    } else {
      return null;
    }
  }

  public setCell(coord: Coordinate2d, value: T): void {
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

  public getNeighbourGroup(coord: Coordinate2d, neighbourGroup: Array<Coordinate2d>): Array<Coordinate2d> {
    let neighbours: Array<Coordinate2d> = [];
    for (const n of neighbourGroup) {
      let nCoord: Coordinate2d = new Coordinate2d(coord.x + n.x, coord.y + n.y);
      if (this.getCell(nCoord) !== null) {
        neighbours.push(nCoord);
      }
    }
    return neighbours;
  }

  public getNeighbours(coord: Coordinate2d): Array<Coordinate2d> {
    return this.getNeighbourGroup(coord, Array2d.neighbours);
  }

  public getNeighboursAdjacent(coord: Coordinate2d): Array<Coordinate2d> {
    return this.getNeighbourGroup(coord, Array2d.neighboursAdjacent);
  }

  public getNeighboursDiagonal(coord: Coordinate2d): Array<Coordinate2d> {
    return this.getNeighbourGroup(coord, Array2d.neighboursDiagonal);
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

  public copy(): Array2d<T> {
    return new Array2d({
      width: this.width,
      height: this.height,
      defaultValue: this.defaultValue,
      data: JSON.parse(JSON.stringify(this.data)),
    });
  }

  public getReachableCells(
    predicate: (data: T) => boolean,
    startCoord: Coordinate2d,
    neighbours: Coordinate2d[]
  ): Coordinate2d[] {
    if (!this.inRange(startCoord)) {
      return [];
    }
    const visited: Set<string> = new Set();
    const queue: Coordinate2d[] = [startCoord];
    visited.add(startCoord.toString());
    const cellsReached: Coordinate2d[] = [];
    if (predicate(this.getCell(startCoord)!)) {
      cellsReached.push(startCoord);
    }

    while (queue.length > 0) {
      const current = queue.pop()!;
      for (const neighbour of this.getNeighbourGroup(current, neighbours)) {
        if (visited.has(neighbour.toString())) {
          continue;
        }
        visited.add(neighbour.toString());
        if (predicate(this.getCell(neighbour)!)) {
          queue.push(neighbour);
          cellsReached.push(neighbour);
        }
      }
    }

    return cellsReached;
  }

  public countReachableCells(
    predicate: (data: T) => boolean,
    startCoord: Coordinate2d,
    neighbours: Coordinate2d[]
  ): number {
    return this.getReachableCells(predicate, startCoord, neighbours).length;
  }

  find(predicate: (param: { value: T; coord: Coordinate2d }) => boolean): Coordinate2d | null {
    for (const cell of this) {
      if (predicate(cell)) {
        return cell.coord;
      }
    }
    return null;
  }

  getShortestPath(
    predicate: (data: T) => boolean,
    startCoord: Coordinate2d,
    endCoord: Coordinate2d,
    neighbours: Coordinate2d[]
  ): Coordinate2d[] | null {
    if (!this.inRange(startCoord) || !this.inRange(endCoord)) {
      return [];
    }
    const visited: Set<string> = new Set();
    const queue: { previousCoords: Coordinate2d[]; currentCoord: Coordinate2d }[] = [
      { previousCoords: [], currentCoord: startCoord },
    ];

    visited.add(startCoord.toString());

    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const neighbour of this.getNeighbourGroup(current.currentCoord, neighbours)) {
        if (visited.has(neighbour.toString())) {
          continue;
        }
        visited.add(neighbour.toString());
        if (predicate(this.getCell(neighbour)!)) {
          if (neighbour.equals(endCoord)) {
            current.previousCoords.push(current.currentCoord);
            current.previousCoords.push(neighbour);
            return current.previousCoords;
          }
          queue.push({ previousCoords: [...current.previousCoords, current.currentCoord], currentCoord: neighbour });
        }
      }
    }

    return null;
  }
}
