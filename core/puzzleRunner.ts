import { PuzzleStatus } from './enums';
import { logger } from './utils';

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
      puzzle = require(`../${year}/day${dayStr}`).puzzle;
    } catch (err) {
      continue;
    }

    if (puzzle) {
      stats[puzzle.status] = stats[puzzle.status] ? stats[puzzle.status] + 1 : 1;
      if (puzzle.status === PuzzleStatus.IN_PROGRESS || (override && puzzle.status !== PuzzleStatus.INEFFICIENT)) {
        logger.logColor(`\r\n######### ${year} day ${dayStr} starting #########`, logger.color.GREEN);
        errors += puzzle.run();
      } else if (puzzle.status === PuzzleStatus.INEFFICIENT) {
        logger.logColor(`\r\n######### ${year} day ${dayStr} needs improvement! #########`, logger.color.YELLOW);
      } else if (puzzle.status === PuzzleStatus.NOT_SOLVED) {
        logger.logColor(`\r\n######### ${year} day ${dayStr} was not completed! #########`, logger.color.RED);
      }
    }
  }
}

for (const key of Object.keys(stats)) {
  logger.log(`${logger.getColor(key, logger.color.CYAN)}: ${logger.getColor(stats[key], logger.color.YELLOW)}`);
}
logger.log(
  `${logger.getColor('Errors', logger.color.CYAN)}: ${logger.getColor(
    errors,
    errors > 0 ? logger.color.RED : logger.color.GREEN
  )}`
);
