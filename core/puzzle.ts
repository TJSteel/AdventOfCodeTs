import { readFileSync } from 'fs';
import { PuzzleStatus } from './enums';
import { logger } from './utils';

export abstract class AbstractPuzzle {
  private year: string;
  private day: string;
  private answers!: {
    test1: any;
    main1: any;
    test2: any;
    main2: any;
  };
  protected input: any[];
  public status: PuzzleStatus;

  /**
   * Creates a new puzzle for the corresponding year / day
   * @param year // the year this puzzle is for
   * @param day // the day of the puzzle
   * @param status // suppress tests if the puzzle is complete
   */
  constructor(year: string, day: string, status: PuzzleStatus) {
    this.year = year;
    this.day = day;
    this.setAnswers(0, 0, 0, 0);
    this.input = [];
    this.status = status;
  }

  public setAnswers(test1: any, main1: any, test2: any, main2: any): void {
    this.answers = {
      test1: test1,
      main1: main1,
      test2: test2,
      main2: main2,
    };
  }

  public parseInput(): void {
    // Optional method for additional parsing of input lines
  }

  private getInput = (folder: string): void => {
    this.input = readFileSync(`${this.year}/${folder}/day${this.day}.txt`, {
      encoding: 'utf-8',
    }).split('\r\n');
  };

  private getTestInput = (): void => {
    this.getInput('testInput');
  };

  private getMainInput = (): void => {
    this.getInput('input');
  };

  public calculateAnswer1(): any {
    throw new Error('calculateAnswer1 not implemented!');
  }

  public calculateAnswer2(): any {
    throw new Error('calculateAnswer2 not implemented!');
  }

  private runner = (name: string, getInput: Function, calculateAnswer: Function, answer: number): boolean => {
    if (answer === -1) {
      logger.logColor(
        `${this.year} day ${this.day} ${name} skipping (because answer is ${answer})`,
        logger.color.YELLOW
      );
      return true;
    }
    logger.logColor(`${this.year} day ${this.day} ${name} running`, logger.color.YELLOW);
    getInput();
    let start = process.hrtime();
    let calculatedAnswer = null;
    try {
      this.parseInput();
      calculatedAnswer = calculateAnswer();
    } catch (err) {
      console.log(err);
    }
    let end = process.hrtime(start);

    logger.log(
      `${logger.getColor(`${this.year} day ${this.day} ${name} answer: `, logger.color.CYAN)}${
        calculatedAnswer === answer
          ? logger.getColor(calculatedAnswer, logger.color.GREEN)
          : logger.getColor(`${calculatedAnswer} != ${answer}`, logger.color.RED)
      }`
    );
    logger.logColor(`${this.year} day ${this.day} ${name} took: ${end[0]}s ${end[1] / 1000000}ms`, logger.color.CYAN);
    return calculatedAnswer === answer;
  };

  public run = (): number => {
    let errors = 0;
    errors += this.runner(`Test 1`, this.getTestInput, this.calculateAnswer1, this.answers.test1) ? 0 : 1;
    errors += this.runner(`Main 1`, this.getMainInput, this.calculateAnswer1, this.answers.main1) ? 0 : 1;
    errors += this.runner(`Test 2`, this.getTestInput, this.calculateAnswer2, this.answers.test2) ? 0 : 1;
    errors += this.runner(`Main 2`, this.getMainInput, this.calculateAnswer2, this.answers.main2) ? 0 : 1;
    return errors;
  };
}
