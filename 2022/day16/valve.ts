export class Valve {
  id: string;
  flowRate: number;
  paths: string[]; // only contains direct neighbours
  pathCosts: Map<string, number>;
  constructor(id: string, flowRate: number, paths: string[], pathCosts?: Map<string, number>) {
    this.id = id;
    this.flowRate = flowRate;
    this.paths = paths;
    this.pathCosts = pathCosts ? pathCosts : new Map();
  }

  copy(): Valve {
    return new Valve(this.id, this.flowRate, this.paths, this.pathCosts);
  }

  static setPathLengths(valves: Map<string, Valve> = new Map()): void {
    valves.forEach((valveFrom) => {
      valves.forEach((valveTo) => {
        if (valveFrom.id !== valveTo.id && valveTo.flowRate > 0) {
          valveFrom.pathCosts.set(valveTo.id, Valve.getPathLength(valves, valveFrom, valveTo));
        }
      });
    });
  }

  static getPathLength(valves: Map<string, Valve> = new Map(), from: Valve, to: Valve): number {
    const queue = [];
    for (const path of from.paths) {
      queue.push({ id: path, length: 0, visited: [] });
    }
    while (queue.length > 0) {
      const current: any = queue.shift()!;
      current.length++;
      if (current.id == to.id) {
        return current.length;
      }
      const next: Valve = valves.get(current.id)!;
      for (const path of next.paths) {
        if (!current.visited.includes(path)) {
          queue.push({ id: path, length: current.length, visited: [...current.visited, path] });
        }
      }
    }
    return 0;
  }
}
