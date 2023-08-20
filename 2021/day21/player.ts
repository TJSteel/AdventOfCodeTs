export class Player {
  position: number;
  points: number = 0;
  name: string;

  constructor(name: string, position: number) {
    this.name = name;
    this.position = position;
  }
  move(count: number) {
    this.position += count;
    while (this.position > 10) {
      this.position -= 10;
    }
    this.points += this.position;
  }
  getState() {
    return `${this.position},${this.points}`;
  }
  loadState(state: string) {
    const parts = state.split(',');
    this.position = parseInt(parts[0]);
    this.points = parseInt(parts[1]);
  }
}
