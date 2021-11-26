export function addFloatingPointNumbers(numberOne: number, numberTwo: number) {
  return Math.round((numberOne + numberTwo) * 1e12) / 1e12;
}
