import { Valve } from './valve';

export class Elf {
  valveId: string;
  minute: number;
  constructor(valve: string, minute: number) {
    this.valveId = valve;
    this.minute = minute;
  }

  openValve(valve: Valve, pathLength: number): number {
    this.minute -= pathLength + 1;
    const pressure = this.minute * valve.flowRate;
    valve.flowRate = 0;
    this.valveId = valve.id;
    return pressure;
  }

  copy(): Elf {
    return new Elf(this.valveId, this.minute);
  }

  hasMoves(valves: Map<string, Valve>): boolean {
    const valve = valves.get(this.valveId)!;

    for (const [id, pathCost] of valve.pathCosts.entries()) {
      const valveTo = valves.get(id)!;
      if (pathCost <= this.minute - 1 && valveTo.flowRate > 0) {
        return true;
      }
    }

    return false;
  }
}
