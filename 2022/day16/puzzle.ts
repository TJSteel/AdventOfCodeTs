import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { Elf } from './elf';
import { getStateString, State } from './interfaces';
import { Valve } from './valve';

function copyValves(valves: Map<string, Valve>): Map<string, Valve> {
  const map = new Map();
  valves.forEach((valve, key) => map.set(key, valve.copy()));
  return map;
}

class Puzzle extends AbstractPuzzle {
  valves: Map<string, Valve> = new Map();
  memoization: Map<string, number> = new Map();
  elfCount: number = 0;
  maxPressure: number = 0;

  setAnswers(): void {
    super.setAnswers(1651, 1775, 1707, 0, { testInputOnly: false });
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
    Valve.setPathLengths(this.valves);
    this.memoization = new Map();
    this.maxPressure;
  }

  getMaxPressure(p1: number, p2: number): number {
    const max = Math.max(p1, p2);
    this.maxPressure = Math.max(this.maxPressure, max);
    return max;
  }

  getHighestPressure(totalMinutes: number): number {
    this.memoization = new Map();
    const elves: Elf[] = [];
    for (let i = 0; i < this.elfCount; i++) {
      elves.push(new Elf('AA', totalMinutes));
    }
    const valves = copyValves(this.valves);

    const state: State = {
      elves,
      valves,
      pressure: 0,
    };
    return this.getHighestPressureDFS(state);
  }

  getHighestPressureDFS(state: State): number {
    const stateString = getStateString(state);
    if (!this.memoization.has(stateString)) {
      this.memoization.set(stateString, this._getHighestPressureDFS(state));
    }
    return this.memoization.get(stateString)!;
  }

  _getHighestPressureDFS(state: State): number {
    const newStates: State[] = [];

    for (let i = 0; i < this.elfCount; i++) {
      const elf: Elf = state.elves[i];
      if (!elf.hasMoves(state.valves)) {
        continue;
      }
      const valve: Valve = state.valves.get(elf.valveId)!;

      valve.pathCosts.forEach((pathLength, pathValveId) => {
        const valveTo = state.valves.get(pathValveId)!;

        if (valveTo.flowRate == 0) {
          return;
        }
        const elves = state.elves.map((elf) => elf.copy());
        const valves = copyValves(state.valves);
        const valve = valves.get(pathValveId)!;

        const elf = elves[i];
        const pressure = state.pressure + elf.openValve(valve, pathLength);
        newStates.push({
          elves,
          valves,
          pressure,
        });
      });
    }

    for (const newState of newStates) {
      state.pressure = this.getMaxPressure(state.pressure, this.getHighestPressureDFS(newState));
    }

    return state.pressure;
  }

  calculateAnswer1 = (): number => {
    this.elfCount = 1;
    return this.getHighestPressure(30);
  };

  calculateAnswer2 = (): number => {
    this.elfCount = 2;
    return this.getHighestPressure(26);
  };
}

export const puzzle = new Puzzle('2022', '16', PuzzleStatus.IN_PROGRESS);
