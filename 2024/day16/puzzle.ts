import { Array2d } from '../../core/array2d';
import { Coordinate2d } from '../../core/coordinate2d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

interface Node {
  coord: Coordinate2d;
  direction: Direction;
  score: number;
  directions: string;
  coords: Coordinate2d[];
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

const directionNeighbours: Map<Direction, Direction[]> = new Map();
directionNeighbours.set(Direction['^'], [Direction['>'], Direction['<']]);
directionNeighbours.set(Direction['v'], [Direction['>'], Direction['<']]);
directionNeighbours.set(Direction['<'], [Direction['^'], Direction['v']]);
directionNeighbours.set(Direction['>'], [Direction['^'], Direction['v']]);

const generateKey = (node: Node): string => {
  return `${node.coord},${node.direction}`;
};

class Puzzle extends AbstractPuzzle {
  map: Array2d<string> = new Array2d();

  setAnswers(): void {
    super.setAnswers(11048, 102504, 64, 535);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split(''));
    this.map = new Array2d({ data: this.input });
  }

  calculateBestScores = (): any => {
    let bestScore = Infinity;
    const bestScoreCoordMap: Map<number, Set<string>> = new Map();
    const startCoord = this.map.find((v) => v.value == 'S');
    const endCoord = this.map.find((v) => v.value == 'E');
    if (!startCoord || !endCoord) {
      throw new Error('Start or End is missing from the map');
    }
    const queue: Node[] = [
      {
        coord: startCoord,
        direction: Direction['>'],
        score: 0,
        directions: '',
        coords: [startCoord],
      },
    ];
    const scoreMap: Map<string, number> = new Map();
    scoreMap.set(generateKey(queue[0]), queue[0].score);
    while (queue.length > 0) {
      queue.sort((a, b) => b.score - a.score);
      const current: Node = queue.pop()!;
      const nextNodes: Node[] = [];
      for (const directionNeighbour of directionNeighbours.get(current.direction)!) {
        const nextTurningCoord = current.coord.copy().add(directions.get(directionNeighbour)!);
        const nextTurningNode: Node = {
          coord: nextTurningCoord,
          direction: directionNeighbour,
          score: current.score + 1001,
          directions: current.directions + Direction[directionNeighbour],
          coords: [...current.coords, nextTurningCoord],
        };
        nextNodes.push(nextTurningNode);
      }

      const nextStraightCoord = current.coord.copy().add(directions.get(current.direction)!);
      const nextStraightNode: Node = {
        coord: nextStraightCoord,
        direction: current.direction,
        score: current.score + 1,
        directions: current.directions + Direction[current.direction],
        coords: [...current.coords, nextStraightCoord],
      };
      nextNodes.push(nextStraightNode);

      for (const next of nextNodes) {
        switch (this.map.getCell(next.coord)) {
          case 'E':
            if (next.score <= bestScore) {
              bestScore = next.score;
              const bestScoreCoordSet: Set<string> = bestScoreCoordMap.get(bestScore)
                ? bestScoreCoordMap.get(bestScore)!
                : new Set();
              for (const coord of next.coords) {
                bestScoreCoordSet.add(coord.toString());
              }
              bestScoreCoordMap.set(bestScore, bestScoreCoordSet);
            }
          case '.':
            const nextKey = generateKey(next);
            if (!scoreMap.has(nextKey)) {
              scoreMap.set(nextKey, next.score);
              queue.push(next);
            } else {
              const visitedScore = scoreMap.get(nextKey)!;
              if (next.score <= visitedScore) {
                scoreMap.set(nextKey, next.score);
                queue.push(next);
              }
            }
          case '#':
          case null:
            break;
        }
      }
    }

    return { score: bestScore, pathSpots: bestScoreCoordMap.get(bestScore)!.size };
  };

  calculateAnswer1 = (): number => {
    return this.calculateBestScores().score;
  };

  calculateAnswer2 = (): number => {
    return this.calculateBestScores().pathSpots;
  };
}

export const puzzle = new Puzzle('2024', '16', PuzzleStatus.COMPLETE);
