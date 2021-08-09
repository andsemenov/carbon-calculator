//Round numbers to 3 digits after comma
export const roundNumber = (num) => {
  const number = Number(num);
  const roundedString = number.toFixed(3);
  return Number(roundedString);
};
