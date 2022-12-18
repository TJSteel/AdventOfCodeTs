import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

class Valve {
  id: string;
  flowRate: number;
  paths: string[];
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
}

interface Queue {
  valve: Valve;
  valves: Map<string, Valve>;
  minute: number;
  pressure: number;
}

function copyValves(valves: Map<string, Valve>): Map<string, Valve> {
  const map = new Map();
  valves.forEach((valve, key) => map.set(key, valve.copy()));
  return map;
}

class Puzzle extends AbstractPuzzle {
  valves: Map<string, Valve> = new Map();

  setAnswers(): void {
    super.setAnswers(1651, 1775, 0, 0);
  }

  parseInput(): void {
    this.valves = new Map();
    this.input.forEach((v) => {
      v = v.replace('Valve ', '');
      v = v.replace(' has flow rate=', ':');
      v = v.replace('; tunnels lead to', '');
      v = v.replace('; tunnel leads to', '');
      v = v.replace(' valve ', ':');
      v = v.replace(' valves ', ':');
      const parts = v.split(':');
      const id = parts[0];
      const flowRate = parseInt(parts[1]);
      const paths = parts[2].includes(',') ? parts[2].split(', ') : [parts[2]];
      this.valves.set(id, new Valve(id, flowRate, paths));
    });
    this.getPathLengths();
  }

  getPathLengths() {
    this.valves.forEach((valveFrom) => {
      this.valves.forEach((valveTo) => {
        if (valveFrom.id !== valveTo.id) {
          valveFrom.pathCosts.set(valveTo.id, this.getPathLength(valveFrom, valveTo));
        }
      });
    });
  }

  getPathLength(from: Valve, to: Valve): number {
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
      const next: Valve = this.valves.get(current.id)!;
      for (const path of next.paths) {
        if (!current.visited.includes(path)) {
          queue.push({ id: path, length: current.length, visited: [...current.visited, path] });
        }
      }
    }
    return 0;
  }

  calculateAnswer1 = (): number => {
    let highestPressure = 0;
    const startValve = this.valves.get('AA')!;
    const queue: Queue[] = [];
    startValve.pathCosts.forEach((length, id) => {
      const valveTo: Valve = this.valves.get(id)!;
      if (valveTo.flowRate == 0) {
        return;
      }
      const valves = copyValves(this.valves);
      const valve = valves.get(id)!;
      const minute = 30 - length;
      queue.push({
        valve,
        valves,
        minute,
        pressure: 0,
      });
    });

    let pathsChecked = 0;
    while (queue.length > 0) {
      pathsChecked++;
      const current: Queue = queue.pop()!;

      current.minute--;
      current.pressure += current.valve.flowRate * current.minute;
      current.valve.flowRate = 0;
      highestPressure = Math.max(highestPressure, current.pressure);

      if (current.minute <= 0) {
        continue;
      }
      let remainingFlowRates = 0;
      current.valves.forEach((value) => (remainingFlowRates += value.flowRate));
      const potentialExtraPressure = remainingFlowRates * current.minute;
      if (current.pressure + potentialExtraPressure < highestPressure) {
        continue;
      }

      current.valve.pathCosts.forEach((length, id) => {
        const valveTo = current.valves.get(id);
        if (valveTo!.flowRate == 0) {
          return;
        }
        const valves = copyValves(current.valves);
        const valve = valves.get(id)!;

        queue.push({
          valve,
          valves,
          minute: current.minute - length,
          pressure: current.pressure,
        });
      });
    }
    return highestPressure;
  };

  calculateAnswer2 = (): number => {
    let answer = 0;

    return answer;
  };
}

export const puzzle = new Puzzle('2022', '16', PuzzleStatus.NOT_SOLVED);
