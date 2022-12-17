import { Coordinate2d } from '../core/coordinate2d';
import { PuzzleStatus } from '../core/enums';
import { AbstractPuzzle } from '../core/puzzle';
import { RockChamber } from './day17/rockChamber';
import { rocks } from './day17/rocks';

class Puzzle extends AbstractPuzzle {
  chamber: RockChamber = new RockChamber();
  setAnswers(): void {
    super.setAnswers(3068, 3153, 1514285714288, 1553665689155);
  }

  parseInput(): void {
    this.chamber = new RockChamber();
    this.input = this.input[0].split('').map((v: string) => (v == '<' ? -1 : 1));
  }

  calculateChamberHeight(totalRocks: number): number {
    const memoization: string[] = [];
    let memoizationLoop: number[] = [];
    let rockIndex = 0;
    const rockMax = rocks.length;
    const inputMax = this.input.length;

    let inputIndex = 0;
    let rockCount = 0;
    while (rockCount < totalRocks) {
      const Rock = rocks[rockIndex];
      rockIndex++;
      rockIndex %= rockMax;

      const rock = new Rock(this.chamber.highestRock + 4);
      while (true) {
        let sidewaysDirection = this.input[inputIndex];
        inputIndex++;
        inputIndex %= inputMax;
        for (const coord of rock.coords) {
          let movedCoord = new Coordinate2d(coord.x + sidewaysDirection, coord.y);
          if (!this.chamber.isCoordinateAvailable(movedCoord)) {
            sidewaysDirection = 0;
            break;
          }
        }
        if (sidewaysDirection !== 0) {
          rock.moveSideways(sidewaysDirection);
        }

        let moveDown = true;
        for (const coord of rock.coords) {
          let movedCoord = new Coordinate2d(coord.x, coord.y - 1);
          if (!this.chamber.isCoordinateAvailable(movedCoord)) {
            this.chamber.isCoordinateAvailable(movedCoord);
            moveDown = false;
            break;
          }
        }
        if (!moveDown) {
          const oldChamberHeight = this.chamber.highestRock + 1;
          this.chamber.addRock(rock);
          rockCount++;
          const newChamberHeight = this.chamber.highestRock + 1;
          const heightChange = newChamberHeight - oldChamberHeight;
          memoization.push(`${rock.constructor.name},${rock.top - oldChamberHeight},${rock.left},${heightChange}`);
          break;
        }
        rock.moveDown();
      }
      // should limit searching too many times
      if (rock.constructor.name == 'SquareRock') {
        memoizationLoop = Puzzle.getMemoLoop(memoization);
        if (memoizationLoop.length > 0) {
          break;
        }
      }
    }

    // use memo loop for the rest
    if (rockCount < totalRocks) {
      return Puzzle.applyMemoLoop(rockCount, totalRocks, memoizationLoop, this.chamber.highestRock + 1);
    }

    return this.chamber.highestRock + 1;
  }

  static getMemoLoop(memoization: string[]): number[] {
    // start searching backwards to find a repeat of the final input, if none there is no loop
    let lastIndex = memoization.length - 1;
    let lastMove = memoization[lastIndex];

    let previousIndex = memoization.length - 2;
    while (previousIndex >= 0) {
      if (memoization[previousIndex] === lastMove) {
        // we now have a potential loop range, check going back to see if the range matches the previous range,
        // if it does we've identified the loop
        const loopLength = lastIndex - previousIndex;
        const startIndex = previousIndex + 1 - loopLength;
        if (startIndex < 0) {
          return []; // if this happens we're investigating a loop which is too large for the current data set
        }

        let isLoop = true;
        for (let i1 = previousIndex, i2 = lastIndex; i1 > 0; i1--, i2--) {
          if (memoization[i1] != memoization[i2]) {
            isLoop = i1 / lastIndex < 0.25;
            break;
          }
        }
        if (isLoop) {
          return memoization.slice(previousIndex + 1).map((v: string) => parseInt(v.split(',')[3]));
        }
      }
      previousIndex--;
    }

    if (previousIndex < 0) {
      return [];
    }

    return [];
  }

  static applyMemoLoop(rockCount: number, totalRocks: number, loopedMoves: number[], height: number): number {
    const loopedMovesHeight = loopedMoves.reduce((p, c) => p + c, 0);
    const loopedMovesLength = loopedMoves.length;

    // calculate how many times this can be applied
    const multiplier = Math.floor((totalRocks - rockCount) / loopedMovesLength);

    rockCount += loopedMovesLength * multiplier;
    height += loopedMovesHeight * multiplier;

    for (let i = 0; i < loopedMovesLength; i++) {
      if (rockCount == totalRocks) {
        break;
      }
      rockCount++;
      height += loopedMoves[i];
    }

    return height;
  }

  calculateAnswer1 = (): number => {
    return this.calculateChamberHeight(2022);
  };

  calculateAnswer2 = (): number => {
    return this.calculateChamberHeight(1000000000000);
  };
}

export const puzzle = new Puzzle('2022', '17', PuzzleStatus.COMPLETE);
