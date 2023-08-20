export class DeterministicDice {
  private rolls: number = 0;
  private nextNumber: number = 0; // init at 0 so that the first roll is 1
  private maxNumber: number = 100;

  constructor(maxNumber: number) {
    this.maxNumber = maxNumber;
  }

  getRoll(): number {
    this.nextNumber++;
    if (this.nextNumber > this.maxNumber) {
      this.nextNumber -= this.maxNumber;
    }
    this.rolls++;
    return this.nextNumber;
  }
  getRolls(): number {
    return this.rolls;
  }
}
