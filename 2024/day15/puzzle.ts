import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

interface Movement {
  from: Coordinate2d;
  to: Coordinate2d;
}

enum Direction {
  '^',
  'v',
  '<',
  '>',
}

const directions: Map<Direction, Coordinate2d> = new Map();
directions.set(Direction['^'], new Coordinate2d(0, -1));
directions.set(Direction['v'], new Coordinate2d(0, 1));
directions.set(Direction['<'], new Coordinate2d(-1, 0));
directions.set(Direction['>'], new Coordinate2d(1, 0));

class Warehouse extends Array2d<string> {
  doPush(direction: Direction, movements: Movement[]) {
    if (movements.length == 0) {
      return;
    }
    switch (direction) {
      case Direction['<']:
        movements.sort((a, b) => a.from.x - b.from.x);
        break;
      case Direction['>']:
        movements.sort((a, b) => b.from.x - a.from.x);
        break;
      case Direction['^']:
        movements.sort((a, b) => a.from.y - b.from.y);
        break;
      case Direction['v']:
        movements.sort((a, b) => b.from.y - a.from.y);
        break;
    }
    movements = movements.filter(
      (m, i) => movements.findIndex((mF) => mF.from.x == m.from.x && mF.from.y == m.from.y) == i
    );
    for (const movement of movements) {
      this.setCell(movement.to, this.getCell(movement.from)!);
      this.setCell(movement.from, '.');
    }
  }
  canPush(direction: Direction, coord: Coordinate2d, movements: Movement[]): boolean {
    const value = this.getCell(coord);
    switch (value) {
      case null:
      case '#':
        return false;
      case '.':
        return true;
    }
    const neighbourCoord = coord.copy().add(directions.get(direction)!);
    const neighbourValue = this.getCell(neighbourCoord);
    let canMove = false;
    let boxPairCoord: Coordinate2d | null = null;
    let boxPairNeighbourCoord: Coordinate2d | null = null;
    switch (neighbourValue) {
      case null:
        throw new Error('Neighbour out of bounds, how did this happen?');
      case '.':
        canMove = true;
        break;
      case 'O':
        canMove = this.canPush(direction, neighbourCoord, movements);
        break;
      case '[':
      case ']':
        if (direction == Direction['<'] || direction == Direction['>']) {
          canMove = this.canPush(direction, neighbourCoord, movements);
        } else {
          const boxPairDirection: Direction = neighbourValue == '[' ? Direction['>'] : Direction['<'];
          boxPairCoord = neighbourCoord.copy().add(directions.get(boxPairDirection)!);
          boxPairNeighbourCoord = boxPairCoord.copy().add(directions.get(direction)!);
          canMove =
            this.canPush(direction, neighbourCoord, movements) && this.canPush(direction, boxPairCoord, movements);
        }
        break;
      case '#':
        canMove = false;
    }
    if (canMove) {
      movements.push({
        from: coord.copy(),
        to: neighbourCoord.copy(),
      });
      if (boxPairCoord !== null) {
        movements.push({
          from: boxPairCoord.copy(),
          to: boxPairNeighbourCoord!.copy(),
        });
      }
    }

    return canMove;
  }
}

class Puzzle extends AbstractPuzzle {
  warehouse: Warehouse = new Warehouse();
  directions: string = '';

  setAnswers(): void {
    super.setAnswers(10092, 1563092, 9021, 1582688);
  }

  parseInput(): void {
    const mapData: [][] = [];
    this.directions = '';

    let isMap = true;
    for (const line of this.input) {
      if (line.length == 0) {
        isMap = false;
        continue;
      }
      if (isMap) {
        let input = '';
        if (this.isPart1) {
          input = line;
        } else {
          for (const char of line) {
            switch (char) {
              case '#':
                input += '##';
                break;
              case 'O':
                input += '[]';
                break;
              case '.':
                input += '..';
                break;
              case '@':
                input += '@.';
                break;
              default:
                throw new Error(`What is this character doing here? ${char}`);
            }
          }
        }
        mapData.push(input.split('') as []);
      } else {
        this.directions += line;
      }
    }

    this.warehouse = new Warehouse({ data: mapData });
  }

  calculateAnswer = (): number => {
    let answer = 0;
    let robotCoord = this.warehouse.find((cell) => cell.value == '@');
    if (robotCoord === null) {
      throw new Error('Cannot find the robots starting position');
    }
    for (const dir of this.directions) {
      let direction: Direction = Direction[dir as keyof typeof Direction];
      let movements: Movement[] = [];
      if (this.warehouse.canPush(direction, robotCoord, movements)) {
        robotCoord.add(directions.get(direction)!);
        this.warehouse.doPush(direction, movements);
      }
    }
    for (const cell of this.warehouse) {
      if (cell.value == 'O' || cell.value == '[') {
        answer += cell.coord.x + cell.coord.y * 100;
      }
    }
    return answer;
  };

  calculateAnswer1 = (): number => {
    return this.calculateAnswer();
  };

  calculateAnswer2 = (): number => {
    return this.calculateAnswer();
  };
}

export const puzzle = new Puzzle('2024', '15', PuzzleStatus.COMPLETE);
