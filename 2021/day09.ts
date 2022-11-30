import { PuzzleStatus } from '../core/enums';
import { AbstractPuzzle } from '../core/puzzle';

class Puzzle extends AbstractPuzzle {
  map: any[] = [];
  height: number = 0;
  width: number = 0;

  setAnswers(): void {
    super.setAnswers(15, 633, 1134, 1050192);
  }

  parseInput(): void {
    this.map = [];
    this.input = this.input.filter((x) => x);
    for (const line of this.input) {
      this.map.push(line.split('').map((n: string) => parseInt(n)));
    }
    this.height = this.map.length;
    this.width = this.map[0].length;
  }

  getCell(x: number, y: number) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.map[y][x];
    }
    return null;
  }

  calculateAnswer1 = (): number => {
    let answer = 0;

    let neighbours = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let low = true;
        let cell = this.getCell(x, y);

        for (const n of neighbours) {
          let nCell = this.getCell(x + n.x, y + n.y);
          if (nCell != null && nCell <= cell) {
            low = false;
          }
        }
        if (low) {
          answer += cell + 1;
        }
      }
    }

    return answer;
  };

  calculateAnswer2 = (): number => {
    let lows = [];
    let neighbours = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];
    let visited: any[] = [];
    for (let y = 0; y < this.height; y++) {
      visited.push([]);
      for (let x = 0; x < this.width; x++) {
        visited[y][x] = false;
        let low = true;
        let cell = this.getCell(x, y);

        for (const n of neighbours) {
          let nCell = this.getCell(x + n.x, y + n.y);
          if (nCell != null && nCell <= cell) {
            low = false;
          }
        }
        if (low) {
          lows.push({ x, y });
        }
      }
    }
    let basins = [];
    while (lows.length > 0) {
      let basin = 1;
      let currentLow: any = lows.pop();
      let cells = [];
      visited[currentLow.y][currentLow.x] = true;
      for (const n of neighbours) {
        let nX = currentLow.x + n.x;
        let nY = currentLow.y + n.y;
        if (this.getCell(nX, nY) !== null && !visited[nY][nX]) {
          cells.push({ x: nX, y: nY });
          visited[nY][nX] = true;
        }
      }
      while (cells.length > 0) {
        let cell: any = cells.pop();
        if (this.getCell(cell.x, cell.y) < 9) {
          basin++;
          for (const n of neighbours) {
            let nX: number = cell.x + n.x;
            let nY: number = cell.y + n.y;
            if (this.getCell(nX, nY) !== null && !visited[nY][nX]) {
              cells.push({ x: nX, y: nY });
              visited[nY][nX] = true;
            }
          }
        }
      }
      basins.push(basin);
    }
    basins = basins.sort((a, b) => b - a);

    let answer = basins[0] * basins[1] * basins[2];
    return answer;
  };
}

export const puzzle = new Puzzle('2021', '09', PuzzleStatus.COMPLETE);
