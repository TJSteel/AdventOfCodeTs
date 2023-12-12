import { Coordinate2d } from './coordinate2d';

const color = {
  BLACK: '30',
  RED: '31',
  GREEN: '32',
  YELLOW: '33',
  BLUE: '34',
  PURPLE: '35',
  CYAN: '36',
  WHITE: '37',
};
const getColor = (str: string, color: string): string => {
  return `\u001b[${color}m${str}\u001b[0m`;
};
const logColor = (str: string, color: string = '37'): void => {
  console.info(getColor(str, color));
};
const log = (str: string): void => {
  console.info(str);
};
export const logger: any = {
  color,
  getColor,
  logColor,
  log,
};

const triangleNumber = (val: number): number => {
  return (val * (val + 1)) / 2;
};
const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};
const isPrime = (num: number): boolean => {
  if (num == 2) return true;
  if (num < 2 || num % 2 == 0) return false;
  for (let i = 3; i * i <= num; i += 2) {
    if (num % i == 0) return false;
  }
  return true;
};
const greatestCommonDenominator = (a: number, b: number): number => {
  while (b != 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};
const _lowestCommonMultiple = (a: number, b: number): number => {
  return (a * b) / greatestCommonDenominator(a, b);
};
const lowestCommonMultiple = (numbers: number[]): number => {
  if (numbers.length < 2) {
    throw new Error(`numbers must contain at least 2 numbers`);
  }
  return numbers.reduce((a, b) => _lowestCommonMultiple(a, b), 1);
};
const polygonArea = (points: Coordinate2d[]): number => {
  let a = 0;
  let b = 0;
  for (let i = 1; i < points.length; i++) {
    a += points[i - 1].x * points[i].y;
    b += points[i].x * points[i - 1].y;
  }
  a += points[points.length - 1].x * points[0].y;
  b += points[0].x * points[points.length - 1].y;

  return Math.abs(a - b) / 2;
};
const sum = (numbers: number[]): number => {
  return numbers.reduce((a, b) => a + b, 0);
};
export const tjMath = {
  triangleNumber,
  degreesToRadians,
  isPrime,
  greatestCommonDenominator,
  lowestCommonMultiple,
  polygonArea,
  sum,
};
