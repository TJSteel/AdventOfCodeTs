import { PuzzleStatus } from '../../core/enums';
import { Map } from '../../core/maps/map';
import { MapNode } from '../../core/maps/mapNode';
import { AbstractPuzzle } from '../../core/puzzle';

class Puzzle extends AbstractPuzzle {
  map: Map = new Map();

  setAnswers(): void {
    super.setAnswers(10, 5076, 36, 145643);
  }

  parseInput(): void {
    this.map = new Map();
    this.input.forEach((i) => {
      let points = i.split('-');
      this.map.addConnection(points[0], points[1]);
    });
  }

  calculateAnswer1 = (): number => {
    let paths = 0;

    let queue: Array<MapNode[]> = [];
    let startNode = this.map.getNode('start');
    startNode.neighbours.forEach((n) => {
      queue.push([startNode, n]);
    });

    while (queue.length > 0) {
      let current: MapNode[] = queue.shift()!;
      let end: MapNode = current[current.length - 1];
      if (end.name === 'end') {
        paths++;
      } else {
        for (let n of end.neighbours) {
          if (n.name.toLowerCase() !== n.name || !current.find((node) => node.name === n.name)) {
            queue.push([...current, n]);
          }
        }
      }
    }

    return paths;
  };

  calculateAnswer2 = (): number => {
    let paths = 0;
    let queue: Array<string> = [];
    let startNode = this.map.getNode('start');
    startNode.neighbours.forEach((n) => {
      queue.push(`${startNode.name}-${n.name}`);
    });

    while (queue.length > 0) {
      let current = queue.pop()!;
      let nodes = current.split('-');
      let end: MapNode = this.map.getNode(nodes[nodes.length - 1]);
      outer: for (let n of end.neighbours) {
        if (n.name === 'end') {
          paths++;
          continue;
        }
        let visited = nodes.filter((v) => v === n.name).length;
        if (n.isSmall && visited == 2) {
          continue;
        }
        if (n.isSmall && visited == 1) {
          for (let node of nodes) {
            if (node.toLowerCase() === node && nodes.filter((n) => n === node).length === 2) {
              continue outer;
            }
          }
        }
        queue.push(`${current}-${n.name}`);
      }
    }
    return paths;
  };
}

export const puzzle = new Puzzle('2021', '12', PuzzleStatus.COMPLETE);
