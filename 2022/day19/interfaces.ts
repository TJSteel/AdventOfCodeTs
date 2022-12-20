export interface Robot {
  type: string;
  cost: { type: string; value: number }[];
}

export interface Resource {
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
}

export interface Inventory {
  resourceCount: Resource;
  robotCount: Resource;
}

export interface State {
  minute: number;
  inventory: Inventory;
  maxGeodes: number;
}
