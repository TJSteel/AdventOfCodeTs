export enum CellType {
  HALLWAY,
  HALLWAY_BLOCKER,
  HOME,
}

export enum CellValue {
  EMPTY,
  A = 1,
  B = 10,
  C = 100,
  D = 1000,
  LOCKED = 99999,
}

export class Path {
  from: Cell;
  to: Cell;
  inbetween: Cell[];
  distance: number;

  constructor(from: Cell, to: Cell, inbetween: Cell[]) {
    this.from = from;
    this.to = to;
    this.inbetween = inbetween;
    this.distance = this.inbetween.length + 1;
  }

  isPathClear(): boolean {
    for (const cell of this.inbetween) {
      if (cell.value !== CellValue.EMPTY) {
        return false;
      }
    }
    if (this.to.value !== CellValue.EMPTY) {
      return false;
    }
    return true;
  }
}

export class Cell {
  private static counter: number = 0;
  readonly id: number;
  type: CellType;
  value: CellValue;
  homeValue: CellValue;
  neighbours: Cell[];
  visited: boolean = false;
  paths: Path[] = [];

  constructor(type: CellType, value: CellValue, homeValue: CellValue) {
    this.id = Cell.counter++;
    this.type = type;
    this.value = value;
    this.homeValue = homeValue;
    this.neighbours = [];
  }

  addNeighbour(cell: Cell) {
    this.neighbours.push(cell);
    cell.neighbours.push(this);
  }

  setValue(value: String | CellValue) {
    switch (value) {
      case '.':
        this.value = CellValue.EMPTY;
        return;
      case 'A':
        this.value = CellValue.A;
        return;
      case 'B':
        this.value = CellValue.B;
        return;
      case 'C':
        this.value = CellValue.C;
        return;
      case 'D':
        this.value = CellValue.D;
        return;
      case 'L':
        this.value = CellValue.LOCKED;
        return;
    }
    if (typeof value !== 'string') {
      this.value = value as CellValue;
    } else {
      throw new Error(`${value} is not a value CellValue type`);
    }
  }
  getValue(): string {
    switch (this.value) {
      case CellValue.A:
        return 'A';
      case CellValue.B:
        return 'B';
      case CellValue.C:
        return 'C';
      case CellValue.D:
        return 'D';
      case CellValue.LOCKED:
        return 'L';
      default:
        return '.';
    }
  }
}
