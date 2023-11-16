import { Cell, CellType, CellValue, Path } from './cell';

export class Level {
  cells: Cell[] = [];
  cost: number = 0;
  bestPotential: number = Infinity;
  bestScore: number = Infinity;

  buildLevel = (input: string[][]): void => {
    this.cells = [];
    for (let i = 0; i < 11; i++) {
      this.cells.push(new Cell(CellType.HALLWAY, CellValue.EMPTY, CellValue.EMPTY));
    }
    this.cells[2].type = CellType.HALLWAY_BLOCKER;
    this.cells[4].type = CellType.HALLWAY_BLOCKER;
    this.cells[6].type = CellType.HALLWAY_BLOCKER;
    this.cells[8].type = CellType.HALLWAY_BLOCKER;

    for (let i = 0; i < 10; i++) {
      this.cells[i].addNeighbour(this.cells[i + 1]);
    }
    const aHome1 = new Cell(CellType.HOME, CellValue.EMPTY, CellValue.A);
    aHome1.setValue(input[2][3]);
    const aHome2 = new Cell(CellType.HOME, CellValue.EMPTY, CellValue.A);
    aHome2.setValue(input[3][3]);
    aHome1.addNeighbour(this.cells[2]);
    aHome1.addNeighbour(aHome2);
    this.cells.push(aHome1);
    this.cells.push(aHome2);

    const bHome1 = new Cell(CellType.HOME, CellValue.EMPTY, CellValue.B);
    bHome1.setValue(input[2][5]);
    const bHome2 = new Cell(CellType.HOME, CellValue.EMPTY, CellValue.B);
    bHome2.setValue(input[3][5]);
    bHome1.addNeighbour(this.cells[4]);
    bHome1.addNeighbour(bHome2);
    this.cells.push(bHome1);
    this.cells.push(bHome2);

    const cHome1 = new Cell(CellType.HOME, CellValue.EMPTY, CellValue.C);
    cHome1.setValue(input[2][7]);
    const cHome2 = new Cell(CellType.HOME, CellValue.EMPTY, CellValue.C);
    cHome2.setValue(input[3][7]);
    cHome1.addNeighbour(this.cells[6]);
    cHome1.addNeighbour(cHome2);
    this.cells.push(cHome1);
    this.cells.push(cHome2);

    const dHome1 = new Cell(CellType.HOME, CellValue.EMPTY, CellValue.D);
    dHome1.setValue(input[2][9]);
    const dHome2 = new Cell(CellType.HOME, CellValue.EMPTY, CellValue.D);
    dHome2.setValue(input[3][9]);
    dHome1.addNeighbour(this.cells[8]);
    dHome1.addNeighbour(dHome2);
    this.cells.push(dHome1);
    this.cells.push(dHome2);

    this.buildPaths();
  };

  buildPaths() {
    for (const cell of this.cells) {
      this.resetVisited();
      cell.visited = true;

      const queue: Path[] = [];
      for (const neighbour of cell.neighbours) {
        const path = new Path(cell, neighbour, []);
        cell.paths.push(path);
        queue.push(path);
        neighbour.visited = true;
      }

      while (queue.length > 0) {
        const currentPath = queue.pop()!;
        for (const neighbour of currentPath.to.neighbours) {
          if (neighbour.visited) {
            continue;
          }
          const path = new Path(cell, neighbour, [...currentPath.inbetween, currentPath.to]);
          cell.paths.push(path);
          queue.push(path);
          neighbour.visited = true;
        }
      }
    }
  }

  resetVisited(): void {
    for (const cell of this.cells) {
      cell.visited = false;
    }
  }

  getState(): string {
    let state = '';
    for (const cell of this.cells) {
      state += cell.getValue();
    }
    state += `,${this.cost}`;
    state += `,${this.getBestPotential()}`;
    return state;
  }

  loadState(state: string): void {
    for (let i = 0, len = this.cells.length; i < len; i++) {
      this.cells[i].setValue(state[i]);
    }
    this.cost = parseInt(state.split(',')[1]);
    this.bestPotential = parseInt(state.split(',')[2]);
  }

  getBestPotential(): number {
    let potential = this.cost;
    for (const cell of this.cells) {
      if (cell.value !== CellValue.EMPTY && cell.value !== CellValue.LOCKED && cell.value !== cell.homeValue) {
        const path = cell.paths.filter((p) => p.to.homeValue === cell.value).sort((a, b) => a.distance - b.distance)[0];
        potential += cell.value * path.distance;
      }
    }
    return potential;
  }

  getAvailableMoves(): string[] {
    const initState = this.getState();
    const availableMoves: string[] = [];
    for (const cell of this.cells) {
      if (cell.value === CellValue.EMPTY || cell.value === CellValue.LOCKED) {
        continue;
      }
      this.loadState(initState);

      const homePaths: Path[] = [];
      const hallwayPaths: Path[] = [];
      const paths: Path[] = [];

      cell.paths.forEach((p) => {
        if (!p.isPathClear()) return;

        if (cell.type === CellType.HALLWAY) {
          if (p.to.homeValue === cell.value) {
            homePaths.push(p);
          }
        } else {
          if (p.to.homeValue === cell.value) {
            homePaths.push(p);
          } else if (p.to.type === CellType.HALLWAY) {
            hallwayPaths.push(p);
          }
        }
      });

      if (homePaths.length === 2) {
        homePaths.filter((p) => p.to.neighbours.length == 1);
      } else if (homePaths.length === 1 && homePaths[0].to.neighbours.length == 2) {
        // only allow here if the room contains another of the same already
        const outerCell = this.cells.find((c) => c.id === homePaths[0].to.id + 1)!;
        if (outerCell.value !== CellValue.LOCKED && outerCell.value !== outerCell.homeValue) {
          homePaths.pop();
        }
      }

      if (homePaths.length > 0) {
        paths.push(...homePaths);
      } else {
        paths.push(...hallwayPaths);
      }

      for (const path of paths) {
        this.cost += cell.value * path.distance;
        path.to.value = cell.value;
        path.from.value = CellValue.EMPTY;
        if (path.to.type === CellType.HOME) {
          path.to.value = CellValue.LOCKED;
        }

        if (this.isSolved()) {
          if (this.cost < this.bestScore) {
            this.bestScore = this.cost;
          }
        } else if (this.cost < this.bestScore) {
          availableMoves.push(this.getState());
        }
        this.loadState(initState);
      }
    }
    return availableMoves;
  }

  isSolved(): boolean {
    for (let i = 11; i <= 18; i++) {
      const cell = this.cells[i];
      if (cell.value !== cell.homeValue && cell.value !== CellValue.LOCKED) {
        return false;
      }
    }
    return true;
  }

  solve(): number {
    let state = this.getState();
    this.bestScore = Infinity;
    const queue: string[] = [state];
    while (queue.length > 0) {
      const currentState: string = queue.pop()!;
      this.loadState(currentState);
      if (this.cost >= this.bestScore || this.bestPotential > this.bestScore) {
        continue;
      }
      const availableMoves: string[] = this.getAvailableMoves();
      queue.push(...availableMoves);
    }

    return this.bestScore;
  }
}
