import { Elf } from './elf';
import { Valve } from './valve';

export interface State {
  elves: Elf[];
  valves: Map<string, Valve>;
  pressure: number;
}

export function getStateString(state: State) {
  const pressure = state.pressure;
  const elves = state.elves.map((e) => `${e.valveId}_${e.minute}`).join(',');
  const closedValves = Array.from(state.valves.values())
    .filter((v) => v.flowRate > 0)
    .map((v) => v.id)
    .join(',');

  return `${pressure}:${elves}:${closedValves}`;
}
