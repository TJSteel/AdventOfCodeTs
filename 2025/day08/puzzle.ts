import { Coordinate3d } from '../../core/coordinate3d';
import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Node {
  coord: Coordinate3d;
  connections: Node[] = [];
  constructor(x: number, y: number, z: number) {
    this.coord = new Coordinate3d(x, y, z);
  }
}

class Connection {
  nodeA: Node;
  nodeB: Node;
  distance: number;
  constructor(nodeA: Node, nodeB: Node) {
    this.nodeA = nodeA;
    this.nodeB = nodeB;
    this.distance = nodeA.coord.distance(nodeB.coord);
  }
}

class Puzzle extends AbstractPuzzle {
  nodes: Node[] = [];
  connections: Connection[] = [];
  groups: Array<Set<String>> = [];

  setAnswers(): void {
    super.setAnswers(40, 75680, 25272, 8995844880);
  }

  parseInput(): void {
    this.input = this.input.map((i) => i.split(',').map((v: string) => parseInt(v)));
    this.nodes = this.input.map((coords: number[]) => new Node(coords[0], coords[1], coords[2]));
    this.connections = [];
    this.groups = [];
    const nodesConnected: Set<string> = new Set();
    for (const node of this.nodes) {
      this.groups.push(new Set([node.coord.toString()]));
      for (const otherNode of this.nodes) {
        if (node === otherNode || nodesConnected.has(`${node.coord.toString()}-${otherNode.coord.toString()}`))
          continue;
        this.connections.push(new Connection(node, otherNode));
        nodesConnected.add(`${node.coord.toString()}-${otherNode.coord.toString()}`);
        nodesConnected.add(`${otherNode.coord.toString()}-${node.coord.toString()}`);
      }
    }
    this.connections.sort((a, b) => a.distance - b.distance);
  }

  addConnection(connection: Connection): void {
    let groupAIndex = this.groups.findIndex((group) => group.has(connection.nodeA.coord.toString()));
    let groupBIndex = this.groups.findIndex((group) => group.has(connection.nodeB.coord.toString()));
    if (groupAIndex === groupBIndex) {
      return;
    }
    const groupA = this.groups[groupAIndex];
    const groupB = this.groups[groupBIndex];

    for (const node of groupB) {
      groupA.add(node);
    }
    this.groups.splice(groupBIndex, 1);
  }

  calculateAnswer1 = (): number => {
    const connectionsNeeded = this.isTest ? 10 : 1000;

    for (let i = 0; i < connectionsNeeded; i++) {
      const connection = this.connections[i];
      this.addConnection(connection);
    }
    this.groups.sort((a, b) => b.size - a.size);

    return this.groups[0].size * this.groups[1].size * this.groups[2].size;
  };

  calculateAnswer2 = (): number => {
    for (const connection of this.connections) {
      this.addConnection(connection);
      if (this.groups.length === 1) {
        return connection.nodeA.coord.x * connection.nodeB.coord.x;
      }
    }
    return 0;
  };
}

export const puzzle = new Puzzle('2025', '08', PuzzleStatus.COMPLETE);
