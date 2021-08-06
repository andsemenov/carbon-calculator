//Round numbers to 2 digits after comma
export const roundNumber = (num) => {
  const number = Number(num);
  const roundedString = number.toFixed(2);
  return Number(roundedString);
};
