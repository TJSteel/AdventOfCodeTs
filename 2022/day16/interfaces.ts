import { Elf } from './elf';
import { Valve } from './valve';

export interface State {
  elf: Elf;
  valves: Valve[];
  pressure: number;
}
