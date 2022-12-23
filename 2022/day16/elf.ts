import { Valve } from './valve';

export class Elf {
  valveId: string;
  minute: number;
  valvesOpened: string;
  constructor(valve: string, minute: number, valvesOpened: string = '') {
    this.valveId = valve;
    this.minute = minute;
    this.valvesOpened = valvesOpened;
  }

  openValve(valve: Valve, pathCosts: Map<string, number>): number {
    const pathCost = pathCosts.get(`${this.valveId}-${valve.id}`)!;
    this.minute -= pathCost + 1;
    const pressure = this.minute * valve.flowRate;
    valve.flowRate = 0;
    this.valveId = valve.id;
    this.valvesOpened += `,${valve.id}`;
    return pressure;
  }

  copy(): Elf {
    return new Elf(this.valveId, this.minute, this.valvesOpened);
  }

  canMove(valve: Valve, pathCosts: Map<string, number>): boolean {
    const pathCost = pathCosts.get(`${this.valveId}-${valve.id}`)!;
    if (pathCost <= this.minute - 1 && valve.flowRate > 0) {
      return true;
    }
    return false;
  }

  hasMoves(valves: Valve[], pathCosts: Map<string, number>): boolean {
    for (const valve of valves) {
      if (this.canMove(valve, pathCosts)) {
        return true;
      }
    }
    return false;
  }

  getValvesOpened(): string[] {
    return this.valvesOpened
      .split(',')
      .filter((v) => v)
      .sort((a, b) => (a > b ? 1 : -1)); // won't ever have a match so don't need to sort if equals
  }
}
