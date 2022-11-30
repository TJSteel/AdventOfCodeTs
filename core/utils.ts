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
  console.log(getColor(str, color));
};
const log = (str: string): void => {
  console.log(str);
};
export const logger: any = {
  color,
  getColor,
  logColor,
  log,
};

export const tjMath = {
  triangleNumber: (val: number): number => {
    return (val * (val + 1)) / 2;
  },
};
