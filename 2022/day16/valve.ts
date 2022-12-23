export class Valve {
  id: string;
  flowRate: number;
  paths: string[]; // only contains direct neighbours
  constructor(id: string, flowRate: number, paths: string[], pathCosts?: Map<string, number>) {
    this.id = id;
    this.flowRate = flowRate;
    this.paths = paths;
  }

  copy(): Valve {
    return new Valve(this.id, this.flowRate, this.paths);
  }

  static getPathCosts(valves: Valve[]): Map<string, number> {
    const pathMap: Map<string, number> = new Map();
    valves.forEach((valveFrom) => {
      valves.forEach((valveTo) => {
        if (valveFrom.id !== valveTo.id && valveTo.flowRate > 0) {
          pathMap.set(`${valveFrom.id}-${valveTo.id}`, Valve.getPathLength(valves, valveFrom, valveTo));
        }
      });
    });
    return pathMap;
  }

  static getPathLength(valves: Valve[], from: Valve, to: Valve): number {
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
      const next: Valve = valves.find((v) => v.id == current.id)!;
      for (const path of next.paths) {
        if (!current.visited.includes(path)) {
          queue.push({ id: path, length: current.length, visited: [...current.visited, path] });
        }
      }
    }
    return 0;
  }
}
