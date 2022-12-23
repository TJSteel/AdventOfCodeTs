import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';
import { Elf } from './elf';
import { State } from './interfaces';
import { Valve } from './valve';

class Puzzle extends AbstractPuzzle {
  valves: Valve[] = [];
  pathCosts: Map<string, number> = new Map();
  valveScores: { valves: string; score: number }[] = [];

  setAnswers(): void {
    super.setAnswers(1651, 1775, 1707, 2351);
  }

  parseInput(): void {
    this.valves = [];
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
      this.valves.push(new Valve(id, flowRate, paths));
    });
    this.pathCosts = Valve.getPathCosts(this.valves);
    this.valveScores = [];
  }

  getHighestPressure(totalMinutes: number, elfCount: number): number {
    const startValve: Valve = this.valves.find((v) => v.id == 'AA')!;
    const elf = new Elf(startValve.id, totalMinutes);
    const valves = this.valves.map((v) => v.copy()).filter((v) => elf.canMove(v, this.pathCosts));
    const initialState: State = {
      elf,
      valves,
      pressure: 0,
    };
    const queue: State[] = [initialState];
    while (queue.length > 0) {
      const state = queue.pop()!;
      for (const nextValve of state.valves) {
        const elf = state.elf.copy();
        let valves = state.valves.map((v) => v.copy());
        const valve = valves.find((v) => v.id == nextValve.id)!;
        let pressure = state.pressure + elf.openValve(valve, this.pathCosts);
        valves = valves.filter((v) => elf.canMove(v, this.pathCosts));
        const valvesOpened = elf.getValvesOpened().join(',');
        const valveScore = this.valveScores.find((v) => v.valves == valvesOpened);
        if (valveScore) {
          valveScore.score = Math.max(valveScore.score, pressure);
        } else {
          this.valveScores.push({ valves: valvesOpened, score: pressure });
        }
        if (valves.length > 0) {
          queue.push({
            elf,
            valves,
            pressure,
          });
        }
      }
    }

    this.valveScores.sort((a, b) => b.score - a.score);

    if (elfCount == 1) {
      return this.valveScores[0].score;
    } else {
      let maxPressure = 0;
      for (let i = 0, len = this.valveScores.length; i < len; i++) {
        jLoop: for (let j = 0; j < len; j++) {
          if (i == j) {
            continue;
          }
          const iScore = this.valveScores[i].score;
          const jScore = this.valveScores[j].score;
          const iValves = this.valveScores[i].valves.split(',');
          const jValves = this.valveScores[j].valves.split(',');

          for (const iValve of iValves) {
            if (jValves.includes(iValve)) {
              continue jLoop;
            }
          }
          maxPressure = Math.max(maxPressure, iScore + jScore);
        }
      }
      return maxPressure;
    }
  }

  calculateAnswer1 = (): number => {
    return this.getHighestPressure(30, 1);
  };

  calculateAnswer2 = (): number => {
    return this.getHighestPressure(26, 2);
  };
}

export const puzzle = new Puzzle('2022', '16', PuzzleStatus.COMPLETE);
