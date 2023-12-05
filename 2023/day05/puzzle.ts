import { PuzzleStatus } from '../../core/enums';
import { AbstractPuzzle } from '../../core/puzzle';

interface Conversion {
  destination: number;
  source: number;
  range: number;
}

const getLowest = (
  destination: number,
  range: number,
  maps: Array<Conversion[]>,
  index: number,
  lowest: number
): number => {
  const map = maps[index];
  if (!map) {
    return destination < lowest ? destination : lowest;
  }

  let low = destination;
  let high = destination + range - 1;

  const ranges: { destination: number; range: number }[] = [];

  while (low <= high) {
    let changes = 0;
    for (const conversion of map) {
      let mapLowest = conversion.source;
      let mapHighest = conversion.source + conversion.range - 1;

      if (mapHighest < low || mapLowest > high) {
        continue;
      }

      if (low >= mapLowest && low <= mapHighest) {
        let destination = low;
        // either how much is left in here or the max the map has to offer
        let range = high - low + 1;
        let mapRangeAvailable = conversion.source + conversion.range - destination;
        if (range > mapRangeAvailable) {
          range = mapRangeAvailable;
        }
        if (range > 0) {
          destination += conversion.destination - conversion.source;
          ranges.push({ destination, range });
          low += range;
          changes++;
        }
      }
    }
    if (!changes) {
      let range = high - low + 1;
      if (range > 0) {
        ranges.push({
          destination: low,
          range,
        });
      }
      break;
    }
  }
  for (const range of ranges) {
    let low = getLowest(range.destination, range.range, maps, index + 1, lowest);
    if (low < lowest) {
      lowest = low;
    }
  }

  return lowest;
};

class Puzzle extends AbstractPuzzle {
  seeds: number[] = [];
  maps: Array<Conversion[]> = [];

  setAnswers(): void {
    super.setAnswers(35, 31599214, 46, 20358599);
  }

  parseInput(): void {
    this.input = this.input.filter((v) => v != '');
    this.seeds = this.input[0]
      .split(': ')[1]
      .split(' ')
      .map((i: string) => parseInt(i));

    this.maps = [];
    this.maps[0] = [];
    let mapIndex = 0;
    for (let i = 2, len = this.input.length; i < len; i++) {
      let line = this.input[i];
      if (line.indexOf('map') > -1) {
        mapIndex++;
        this.maps[mapIndex] = [];
        continue;
      }
      let numbers = line.split(' ').map((i: string) => parseInt(i));
      this.maps[mapIndex].push({
        destination: numbers[0],
        source: numbers[1],
        range: numbers[2],
      });
    }
    this.maps.forEach((map) => map.sort((a, b) => a.source - b.source));
  }

  calculateAnswer1 = (): number => {
    let answer = Infinity;

    for (const seed of this.seeds) {
      let lowest = getLowest(seed, 1, this.maps, 0, answer);
      if (lowest < answer) {
        answer = lowest;
      }
    }

    return answer;
  };

  calculateAnswer2 = (): number => {
    let answer = Infinity;

    for (let i = 0, len = this.seeds.length; i < len; i += 2) {
      let destination = this.seeds[i];
      let range = this.seeds[i + 1];

      let lowest = getLowest(destination, range, this.maps, 0, answer);
      if (lowest < answer) {
        answer = lowest;
      }
    }

    return answer;
  };
}

export const puzzle = new Puzzle('2023', '05', PuzzleStatus.COMPLETE);
