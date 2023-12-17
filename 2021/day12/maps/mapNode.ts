export class MapNode {
  name: string;
  isSmall: boolean;
  neighbours: MapNode[];

  constructor(name: string, neighbours: MapNode[] = [], visited: number = 0) {
    this.name = name;
    this.isSmall = this.name.toLowerCase() === this.name;
    this.neighbours = neighbours;
  }

  public addNeighbour(node: MapNode): void {
    if (node.name !== 'start' && !this.neighbours.find((n) => n.name === node.name)) {
      this.neighbours.push(node);
    }
  }
}
