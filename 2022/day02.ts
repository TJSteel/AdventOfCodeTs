import { PuzzleStatus } from '../core/enums';
import { AbstractPuzzle } from '../core/puzzle';

enum Move {
  ROCK,
  PAPER,
  SCISSORS,
}
enum Result {
  WIN,
  LOSE,
  DRAW,
}

class Game {
  you!: Move;
  opponent!: Move;
  outcome!: Result;
  constructor(opponent: string, you: string) {
    switch (opponent) {
      case 'A':
        this.opponent = Move.ROCK;
        break;
      case 'B':
        this.opponent = Move.PAPER;
        break;
      case 'C':
        this.opponent = Move.SCISSORS;
        break;
    }
    switch (you) {
      case 'X':
        this.you = Move.ROCK;
        this.outcome = Result.LOSE;
        break;
      case 'Y':
        this.you = Move.PAPER;
        this.outcome = Result.DRAW;
        break;
      case 'Z':
        this.you = Move.SCISSORS;
        this.outcome = Result.WIN;
        break;
    }
  }

  calculateScore(): number {
    let score = 0;
    switch (this.you) {
      case Move.ROCK:
        score += 1;
        switch (this.opponent) {
          case Move.ROCK:
            score += 3;
            break;
          case Move.SCISSORS:
            score += 6;
            break;
        }
        break;
      case Move.PAPER:
        score += 2;
        switch (this.opponent) {
          case Move.ROCK:
            score += 6;
            break;
          case Move.PAPER:
            score += 3;
            break;
        }
        break;
      case Move.SCISSORS:
        score += 3;
        switch (this.opponent) {
          case Move.PAPER:
            score += 6;
            break;
          case Move.SCISSORS:
            score += 3;
            break;
        }
        break;
    }
    return score;
  }

  calculateYourMove(): void {
    switch (this.outcome) {
      case Result.WIN:
        switch (this.opponent) {
          case Move.ROCK:
            this.you = Move.PAPER;
            break;
          case Move.PAPER:
            this.you = Move.SCISSORS;
            break;
          case Move.SCISSORS:
            this.you = Move.ROCK;
            break;
        }
        break;
      case Result.LOSE:
        switch (this.opponent) {
          case Move.ROCK:
            this.you = Move.SCISSORS;
            break;
          case Move.PAPER:
            this.you = Move.ROCK;
            break;
          case Move.SCISSORS:
            this.you = Move.PAPER;
            break;
        }
        break;
      case Result.DRAW:
        this.you = this.opponent;
        break;
    }
  }
}

class Puzzle extends AbstractPuzzle {
  games: Game[] = [];
  setAnswers(): void {
    super.setAnswers(15, 15691, 12, 12989);
  }

  parseInput(): void {
    this.games = [];
    this.input.forEach((line) => {
      const moves = line.split(' ');
      this.games.push(new Game(moves[0], moves[1]));
    });
  }

  calculateAnswer1 = (): number => {
    let score = 0;
    for (const game of this.games) {
      score += game.calculateScore();
    }
    return score;
  };

  calculateAnswer2 = (): number => {
    let score = 0;
    for (const game of this.games) {
      game.calculateYourMove();
      score += game.calculateScore();
    }
    return score;
  };
}

export const puzzle = new Puzzle('2022', '02', PuzzleStatus.COMPLETE);
