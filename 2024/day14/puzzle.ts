import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

import fs from 'fs';

class Puzzle extends AbstractPuzzle {
  robots: { point: Coordinate2d; velocity: Coordinate2d }[] = [];

  setAnswers(): void {
    super.setAnswers(12, 224438715, -1, 7603);
  }

  parseInput(): void {
    this.robots = [];
    for (const line of this.input) {
      const [pX, pY, vX, vY] = line
        .match(/p=([\d\-]{1,10}),([\d\-]{1,10}) v=([\d\-]{1,10}),([\d\-]{1,10})/)
        .slice(1, 5)
        .map(Number);
      this.robots.push({
        point: new Coordinate2d(pX, pY),
        velocity: new Coordinate2d(vX, vY),
      });
    }
  }

  calculateAnswer1 = (): number => {
    let answer = 0;
    const width = this.isTest ? 11 : 101;
    const height = this.isTest ? 7 : 103;
    const seconds = 100;

    for (const robot of this.robots) {
      robot.velocity.multiply(seconds);
      robot.point.add(robot.velocity);
      robot.point.x = robot.point.x % width;
      robot.point.y = robot.point.y % height;
      while (robot.point.x < 0) {
        robot.point.x += width;
      }
      while (robot.point.y < 0) {
        robot.point.y += height;
      }
    }

    const quadrants = [
      {
        startCoord: new Coordinate2d(0, 0),
        endCoord: new Coordinate2d(Math.floor(width / 2) - 1, Math.floor(height / 2) - 1),
      },
      {
        startCoord: new Coordinate2d(Math.floor(width / 2) + 1, 0),
        endCoord: new Coordinate2d(width - 1, Math.floor(height / 2) - 1),
      },
      {
        startCoord: new Coordinate2d(0, Math.floor(height / 2) + 1),
        endCoord: new Coordinate2d(Math.floor(width / 2) - 1, height - 1),
      },
      {
        startCoord: new Coordinate2d(Math.floor(width / 2) + 1, Math.floor(height / 2) + 1),
        endCoord: new Coordinate2d(width - 1, height - 1),
      },
    ];
    answer = 1;
    for (const quadrant of quadrants) {
      answer *= this.robots.filter(
        (robot) =>
          robot.point.x >= quadrant.startCoord.x &&
          robot.point.y >= quadrant.startCoord.y &&
          robot.point.x <= quadrant.endCoord.x &&
          robot.point.y <= quadrant.endCoord.y
      ).length;
    }

    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;
    // const width = 101;
    // const height = 103;
    // let fileData = '';
    // for (let i = 1; i < 10000; i++) {
    //   fileData += `\n\n${i} Second${i != 1 ? 's' : ''}\n`;
    //   const map = new Array2d({ width, height, defaultValue: ' ' });
    //   for (const robot of this.robots) {
    //     robot.point.add(robot.velocity);
    //     robot.point.x = robot.point.x % width;
    //     robot.point.y = robot.point.y % height;
    //     while (robot.point.x < 0) {
    //       robot.point.x += width;
    //     }
    //     while (robot.point.y < 0) {
    //       robot.point.y += height;
    //     }
    //     map.setCell(robot.point, '#');
    //   }
    //   fileData += map.toString();
    // }

    // const dataFile = `./output.txt`;
    // fs.writeFileSync(dataFile, fileData, { encoding: 'utf-8' });
    // console.log(`${dataFile} created successfully!`);

    // After using the above to generate a file with the contents of the robots on each turn I noticed this
    // while scrolling there was a section where a lot were grouped vertically, then another where they were grouped horizontally
    // This pattern seemed to continue so the answer can be found by looking for the first overlap of the horizontal and vertical pattern

    let verticalFirst = 28;
    let horizontalFirst = 84;
    let verticalEvery = 129 - verticalFirst; // 101
    let horizontalEvery = 187 - horizontalFirst; // 103

    let hArray = [horizontalFirst];
    let vArray = [verticalFirst];

    while (verticalFirst < 10403) {
      vArray.push((verticalFirst += verticalEvery));
    }
    while (horizontalFirst < 10403) {
      hArray.push((horizontalFirst += horizontalEvery));
    }
    for (const v of vArray) {
      if (hArray.includes(v)) {
        answer = v;
        break;
      }
    }

    const width = 101;
    const height = 103;
    const seconds = answer;

    for (const robot of this.robots) {
      robot.velocity.multiply(seconds);
      robot.point.add(robot.velocity);
      robot.point.x = robot.point.x % width;
      robot.point.y = robot.point.y % height;
      while (robot.point.x < 0) {
        robot.point.x += width;
      }
      while (robot.point.y < 0) {
        robot.point.y += height;
      }
    }
    const map = new Array2d({ width, height, defaultValue: ' ' });
    for (const robot of this.robots) {
      map.setCell(robot.point, '#');
    }
    map.print();

    return answer;
  };
}

export const puzzle = new Puzzle('2024', '14', PuzzleStatus.COMPLETE);
