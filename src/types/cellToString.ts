import { Cell, CELL_LENGTH } from './all';

export function cellToString(cell: Cell): string {
  const str = cell.toString(2).padStart(CELL_LENGTH, '0');

  return `0b${str[0]}_${str[1]}_${str.slice(2, 6)}_${str.slice(
    6,
    9
  )}_${str.slice(9, str.length)}`;
}
