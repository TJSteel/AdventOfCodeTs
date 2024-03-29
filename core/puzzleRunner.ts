import { PuzzleStatus } from './enums';
import { Logger } from './utils/logger';

const stats: any = {};
const all = process.argv[2];
const override = all == '-all';
const today = new Date();
const yearToday = today.getFullYear();
let errors = 0;
for (let year = 2015; year <= yearToday; year++) {
  for (let day = 1; day <= 25; day++) {
    let dayStr = day < 10 ? `0${day}` : day;
    let puzzle = null;
    try {
      puzzle = require(`../${year}/day${dayStr}/puzzle`).puzzle;
    } catch (err: any) {
      if (err.code && err.code === 'MODULE_NOT_FOUND') {
        continue;
      }
      throw new Error(err);
    }

    if (puzzle) {
      stats[puzzle.status] = stats[puzzle.status] ? stats[puzzle.status] + 1 : 1;
      if (
        puzzle.status === PuzzleStatus.IN_PROGRESS ||
        (override && puzzle.status !== PuzzleStatus.INEFFICIENT && puzzle.status !== PuzzleStatus.NOT_SOLVED)
      ) {
        Logger.logColor(`\r\n######### ${year} day ${dayStr} starting #########`, Logger.color.GREEN);
        errors += puzzle.run();
      } else if (puzzle.status === PuzzleStatus.INEFFICIENT) {
        Logger.logColor(`\r\n######### ${year} day ${dayStr} needs improvement! #########`, Logger.color.YELLOW);
      } else if (puzzle.status === PuzzleStatus.NOT_SOLVED) {
        Logger.logColor(`\r\n######### ${year} day ${dayStr} was not completed! #########`, Logger.color.RED);
      }
    }
  }
}

for (const key of Object.keys(stats)) {
  Logger.log(`${Logger.getColor(key, Logger.color.CYAN)}: ${Logger.getColor(stats[key], Logger.color.YELLOW)}`);
}
Logger.log(
  `${Logger.getColor('Errors', Logger.color.CYAN)}: ${Logger.getColor(
    errors,
    errors > 0 ? Logger.color.RED : Logger.color.GREEN
  )}`
);
