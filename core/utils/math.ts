import { Coordinate2d } from '../coordinate2d';

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
  const calculateCoord = (a: Coordinate2d, b: Coordinate2d): number => {
    return (b.y - a.y) * (b.x + a.x);
  };
  let area = 0;
  for (let i = 0; i < points.length - 1; i++) {
    area += calculateCoord(points[i], points[i + 1]);
  }
  area += calculateCoord(points[points.length - 1], points[0]);
  return Math.abs(area) / 2;
};
const sum = (numbers: number[]): number => {
  return numbers.reduce((a, b) => a + b, 0);
};
export const TjMath = {
  triangleNumber,
  degreesToRadians,
  isPrime,
  greatestCommonDenominator,
  lowestCommonMultiple,
  polygonArea,
  sum,
};
