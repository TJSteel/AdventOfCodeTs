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
export const Logger: any = {
  color,
  getColor,
  logColor,
  log,
};
