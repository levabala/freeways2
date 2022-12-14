import { left, right } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { Cell, Coordinate, TransputId, Room, TransputType } from '../types';
import { ErrorLifecycle } from './errors';
import { isCoordValid, coordToIndex } from './utils';

const cellHasTransputMask = 0b1_0_0000_000_0000000000;
const cellHasTransputOffset = Math.log2(cellHasTransputMask);
function cellHasTransput(cell: Cell): boolean {
  return (cell & cellHasTransputMask) >>> cellHasTransputOffset === 1;
}

function cellMarkHasTransput(cell: Cell): Cell {
  return cell | cellHasTransputMask;
}

function cellMarkHasNoTransput(cell: Cell): Cell {
  return cell & ~cellHasTransputMask;
}

const transputIdMask = 0b1111;
const cellTransputIdMask = 0b0_0_1111_000_0000000000;
const cellTransputIdMaskOffset = Math.log2(
  cellTransputIdMask & -cellTransputIdMask
);
const cellSetTransputId =
  (transputId: TransputId) =>
  (cell: Cell): Cell => {
    const cellWithoutId = cell & ~cellTransputIdMask;
    const transputIdWithoutHead = transputId & transputIdMask;

    return cellWithoutId | (transputIdWithoutHead << cellTransputIdMaskOffset);
  };

const cellRemoveTransputId = (cell: Cell): Cell => {
  return cell & ~cellTransputIdMask;
};

const cellTransputTypeMask = 0b0_1_0000_000_0000000000;
const cellTransputTypeMaskOffset = Math.log2(cellTransputTypeMask);
const cellSetTransputType =
  (transputType: TransputType) =>
  (cell: Cell): Cell => {
    const cellWithoutId = cell & ~cellTransputTypeMask;

    return cellWithoutId | (transputType << cellTransputTypeMaskOffset);
  };

const cellGetTransputType = (cell: Cell): TransputType => {
  return (cell & cellTransputTypeMask) > 0 ? 1 : 0;
};

export function getTransputType(room: Room, coord: Coordinate) {
  if (isCoordValid(room, coord)) {
    return left(ErrorLifecycle.ERROR_INVALID_COORD);
  }

  const index = coordToIndex(room.size, coord);
  const cell = room.cells[index];

  return right(cellGetTransputType(cell));
}

export function addTransput(
  room: Room,
  transputId: TransputId,
  transputType: TransputType,
  coord: Coordinate
) {
  if (transputId > transputIdMask) {
    return left(ErrorLifecycle.ERROR_TRANSPUT_ID_IS_TOO_BIG);
  }

  if (isCoordValid(room, coord)) {
    return left(ErrorLifecycle.ERROR_INVALID_COORD);
  }

  const index = coordToIndex(room.size, coord);

  const cell = room.cells[index];
  const hasTransputOrOutput = cellHasTransput(cell);

  if (hasTransputOrOutput) {
    return left(ErrorLifecycle.ERROR_ALREADY_HAS_TRANSPUT_OR_OUTPUT);
  }

  const cellWithTransputId = pipe(
    cell,
    cellMarkHasTransput,
    cellSetTransputType(transputType),
    cellSetTransputId(transputId)
  );

  room.cells[index] = cellWithTransputId;

  return right(room);
}

export function removeTransput(room: Room, coord: Coordinate) {
  if (isCoordValid(room, coord)) {
    return left(ErrorLifecycle.ERROR_INVALID_COORD);
  }

  const index = coordToIndex(room.size, coord);

  const cell = room.cells[index];
  const hasTransputOrOutput = cellHasTransput(cell);

  if (!hasTransputOrOutput) {
    return left(ErrorLifecycle.ERROR_ALREADY_HAS_NO_TRANSPUT_OR_OUTPUT);
  }

  const cellWithoutTransputId = pipe(
    cell,
    cellMarkHasNoTransput,
    cellRemoveTransputId
  );

  room.cells[index] = cellWithoutTransputId;

  return right(room);
}
