import { MapNode } from './mapNode';

export class Map {
  nodes: Array<MapNode>;
  constructor() {
    this.nodes = [];
  }

  public addNode(name: string): MapNode {
    let node = this.nodes.find((n) => n.name === name);
    if (!node) {
      node = new MapNode(name);
      this.nodes.push(node);
    }
    return node;
  }

  public getNode(name: string): MapNode {
    let node = this.nodes.find((n) => n.name === name);
    if (!node) {
      return this.addNode(name);
    } else {
      return node;
    }
  }

  public addConnection(from: string, to: string): void {
    let fromNode: MapNode = this.getNode(from);
    let toNode: MapNode = this.getNode(to);
    fromNode.addNeighbour(toNode);
    toNode.addNeighbour(fromNode);
  }
}
