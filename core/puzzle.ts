import { readFileSync } from 'fs';
import { PuzzleStatus } from './enums';
import { Logger } from './utils/logger';

interface AdditionalPuzzleSettings {
  testInputOnly?: boolean;
  lowAnswers?: PuzzleAnswer;
  highAnswers?: PuzzleAnswer;
}

interface PuzzleAnswer {
  test1?: any;
  main1?: any;
  test2?: any;
  main2?: any;
}

export abstract class AbstractPuzzle {
  private year: string;
  private day: string;
  private answers!: PuzzleAnswer;
  private lowAnswers?: PuzzleAnswer;
  private highAnswers?: PuzzleAnswer;
  private testInputOnly: boolean = false;
  protected input: any[];
  public status: PuzzleStatus;
  public isTest: boolean = false;

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

  public setAnswers(test1: any, main1: any, test2: any, main2: any, settings?: AdditionalPuzzleSettings): void {
    this.answers = {
      test1: test1,
      main1: main1,
      test2: test2,
      main2: main2,
    };
    this.testInputOnly = settings?.testInputOnly ? true : false;
    this.lowAnswers = settings?.lowAnswers;
    this.highAnswers = settings?.highAnswers;
  }

  public parseInput(): void {
    // Optional method for additional parsing of input lines
  }

  private getInput = (inputFile: string): void => {
    this.input = readFileSync(`${this.year}/day${this.day}/input/${inputFile}.txt`, {
      encoding: 'utf-8',
    })
      .replace(/\r/g, '')
      .split('\n');
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

  private runner = (
    name: string,
    getInput: Function,
    calculateAnswer: Function,
    testKey: keyof PuzzleAnswer
  ): boolean => {
    const answer = this.answers[testKey];

    this.isTest = name.includes('Test');
    if (answer === -1) {
      Logger.logColor(
        `${this.year} day ${this.day} ${name} skipping (because answer is ${answer})`,
        Logger.color.YELLOW
      );
      return true;
    }
    Logger.logColor(`${this.year} day ${this.day} ${name} running`, Logger.color.YELLOW);
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

    let answerString = ``;
    if (calculatedAnswer === answer) {
      answerString = Logger.getColor(calculatedAnswer, Logger.color.GREEN);
    } else if (
      this.lowAnswers &&
      this.lowAnswers[testKey] &&
      calculatedAnswer <= this.lowAnswers[testKey].sort((a: number, b: number) => b - a)[0]
    ) {
      answerString = Logger.getColor(`${calculatedAnswer} is too low`, Logger.color.RED);
    } else if (
      this.highAnswers &&
      this.highAnswers[testKey] &&
      calculatedAnswer >= this.highAnswers[testKey].sort((a: number, b: number) => a - b)[0]
    ) {
      answerString = Logger.getColor(`${calculatedAnswer} is too high`, Logger.color.RED);
    } else if ((this.lowAnswers && this.lowAnswers[testKey]) || (this.highAnswers && this.highAnswers[testKey])) {
      answerString = Logger.getColor(`${calculatedAnswer} is a potential answer`, Logger.color.GREEN);
    } else {
      answerString = Logger.getColor(`${calculatedAnswer} != ${answer}`, Logger.color.RED);
    }

    Logger.log(`${Logger.getColor(`${this.year} day ${this.day} ${name} answer: `, Logger.color.CYAN)}${answerString}`);
    Logger.logColor(`${this.year} day ${this.day} ${name} took: ${end[0]}s ${end[1] / 1000000}ms`, Logger.color.CYAN);
    return calculatedAnswer === answer;
  };

  public run = (): number => {
    let errors = 0;
    errors += this.runner(`Test 1`, this.getTestInput, this.calculateAnswer1, 'test1') ? 0 : 1;
    if (!this.testInputOnly) {
      errors += this.runner(`Main 1`, this.getMainInput, this.calculateAnswer1, 'main1') ? 0 : 1;
    }
    errors += this.runner(`Test 2`, this.getTestInput, this.calculateAnswer2, 'test2') ? 0 : 1;
    if (!this.testInputOnly) {
      errors += this.runner(`Main 2`, this.getMainInput, this.calculateAnswer2, 'main2') ? 0 : 1;
    }
    return errors;
  };
}
