import { Resource, Robot, State } from './interfaces';
const triangle = (count: number): number => {
  return (count * (count + 1)) / 2;
};
export class Blueprint {
  static maxGeodes: number = 0;
  static totalMinutes = 24;
  id: number;
  factoryRobots: Robot[];
  maxCost: Resource = {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: 0,
  };
  memoization: Map<string, number> = new Map();

  constructor(blueprint: string) {
    this.memoization = new Map();
    const parts = blueprint
      .replace(':', '')
      .split(' ')
      .map((v) => parseInt(v))
      .filter((v) => !isNaN(v));

    this.id = parts[0];
    this.factoryRobots = [
      {
        type: 'geode',
        cost: [
          { type: 'ore', value: parts[5] },
          { type: 'obsidian', value: parts[6] },
        ],
      },
      {
        type: 'obsidian',
        cost: [
          { type: 'ore', value: parts[3] },
          { type: 'clay', value: parts[4] },
        ],
      },
      { type: 'clay', cost: [{ type: 'ore', value: parts[2] }] },
      { type: 'ore', cost: [{ type: 'ore', value: parts[1] }] },
    ];

    for (const robot of this.factoryRobots) {
      for (const cost of robot.cost) {
        const key = cost.type as keyof Resource;
        this.maxCost[key] = Math.max(this.maxCost[key], cost.value);
      }
    }
  }

  static getMaxGeode(g1: number, g2: number) {
    const max = Math.max(g1, g2);
    Blueprint.maxGeodes = Math.max(Blueprint.maxGeodes, max);
    return max;
  }

  private _calculateTotalGeodes(state: State): number {
    const canBuy: Robot[] = [];
    const remainingMinutes = Blueprint.totalMinutes - state.minute;

    if (state.minute < Blueprint.totalMinutes) {
      factoryRobotLoop: for (const factoryRobot of this.factoryRobots) {
        const key = factoryRobot.type as keyof Resource;
        if (key !== 'geode') {
          // if it's a geode we always want to build more, but if not, we don't want to build to produce more resource than we could ever spend
          const totalResourceAtEnd =
            state.inventory.resourceCount[key] + state.inventory.robotCount[key] * remainingMinutes;
          const maxCouldSpend = this.maxCost[key] * remainingMinutes;
          if (totalResourceAtEnd >= maxCouldSpend) {
            continue; // no point buying more
          }
        }
        for (const cost of factoryRobot.cost) {
          const resourceCount = state.inventory.resourceCount[cost.type as keyof Resource];
          if (resourceCount < cost.value) {
            continue factoryRobotLoop;
          }
        }
        canBuy.push(factoryRobot);
        if (key === 'geode') {
          break;
        }
      }
    }

    for (const key of Object.keys(state.inventory.robotCount)) {
      const robotCount = state.inventory.robotCount[key as keyof Resource];
      state.inventory.resourceCount[key as keyof Resource] += robotCount;
    }

    state.maxGeodes = Blueprint.getMaxGeode(state.maxGeodes, state.inventory.resourceCount.geode);

    let potentialGeodes = triangle(remainingMinutes + 1);
    potentialGeodes += state.inventory.robotCount.geode * remainingMinutes;
    potentialGeodes += state.inventory.resourceCount.geode;
    if (potentialGeodes < Blueprint.maxGeodes) {
      return Blueprint.maxGeodes;
    }

    if (state.minute == Blueprint.totalMinutes) {
      return Math.max(state.maxGeodes, Blueprint.maxGeodes);
    }

    state.minute++;
    for (const robot of canBuy) {
      const newState: State = {
        minute: state.minute,
        inventory: {
          resourceCount: { ...state.inventory.resourceCount },
          robotCount: { ...state.inventory.robotCount },
        },
        maxGeodes: state.maxGeodes,
      };
      newState.inventory.robotCount[robot.type as keyof Resource]++;

      for (const cost of robot.cost) {
        newState.inventory.resourceCount[cost.type as keyof Resource] -= cost.value;
      }
      state.maxGeodes = Blueprint.getMaxGeode(state.maxGeodes, this.calculateTotalGeodes(newState));
    }
    return this.calculateTotalGeodes(state);
  }

  static getStateString(state: State) {
    let stateString = `${state.minute}:${Object.values(state.inventory.resourceCount).join(',')}:${Object.values(
      state.inventory.robotCount
    ).join(',')}`;

    return stateString;
  }

  calculateTotalGeodes(state: State): number {
    const stateString = Blueprint.getStateString(state);
    if (!this.memoization.has(stateString)) {
      this.memoization.set(stateString, this._calculateTotalGeodes(state));
    }
    return this.memoization.get(stateString)!;
  }
}
