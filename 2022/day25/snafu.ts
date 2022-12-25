const snafuToDecimalValues = {
  '2': 2,
  '1': 1,
  '0': 0,
  '-': -1,
  '=': -2,
};
const decimalToSnafuValues = {
  '2': '2',
  '1': '1',
  '0': '0',
  '-1': '-',
  '-2': '=',
};

export class Snafu {
  static snafuToDecimal(snafu: string): number {
    let decimal = 0;

    const parts = snafu
      .split('')
      .reverse()
      .map((v) => snafuToDecimalValues[v as keyof typeof snafuToDecimalValues]);
    let multiplier = 1;

    for (const part of parts) {
      decimal += part * multiplier;
      multiplier *= 5;
    }
    return decimal;
  }

  static decimalToSnafu(decimal: number): string {
    let highestMultiplier = 1;
    const multipliers = [highestMultiplier];
    const multiplierCounts: number[] = [0];
    // get all multipliers
    while (decimal > highestMultiplier * 2) {
      highestMultiplier *= 5;
      multipliers.unshift(highestMultiplier);
      multiplierCounts.push(0);
    }
    const length = multipliers.length;

    // go down the multiplier adding 2 of each until decimal is <= 0
    for (let i = length - 1; i >= 0; i--) {
      // if greater than multiplier 1
      while (decimal > 0 && multiplierCounts[i] < 2) {
        decimal -= multipliers[i];
        multiplierCounts[i]++;
      }
    }

    // go down the multipliers again subtracting as much as possible
    for (let i = 0; i < length; i++) {
      while (decimal + multipliers[i] <= 0 && multiplierCounts[i] > -2) {
        decimal += multipliers[i];
        multiplierCounts[i]--;
      }
    }

    // map the multiplier counts to snafu values
    return multiplierCounts
      .map((v) => decimalToSnafuValues[v.toString() as keyof typeof decimalToSnafuValues])
      .join('');
  }

  static tests(): void {
    Snafu.test(1, '1');
    Snafu.test(2, '2');
    Snafu.test(3, '1=');
    Snafu.test(4, '1-');
    Snafu.test(5, '10');
    Snafu.test(6, '11');
    Snafu.test(7, '12');
    Snafu.test(8, '2=');
    Snafu.test(9, '2-');
    Snafu.test(10, '20');
    Snafu.test(15, '1=0');
    Snafu.test(20, '1-0');
    Snafu.test(2022, '1=11-2');
    Snafu.test(12345, '1-0---0');
    Snafu.test(314159265, '1121-1110-1=0');
  }

  static test(decimal: number, snafu: string) {
    const snafuStr = Snafu.decimalToSnafu(decimal);
    if (snafuStr !== snafu) {
      console.log(`${decimal} - ${snafuStr} !== ${snafu}`);
    } else {
      console.log(`${decimal} is good :D`);
    }
  }
}
