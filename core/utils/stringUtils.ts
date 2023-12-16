const trim = (string: string, char: string): string => {
  while (string[0] == char) {
    string = string.substring(1);
  }
  while (string[string.length - 1] == char) {
    string = string.substring(0, string.length - 1);
  }
  return string;
};
export const StringUtils = {
  trim,
};
