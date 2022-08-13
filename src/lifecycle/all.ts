import { Either, left, right } from 'fp-ts/lib/Either';
import {
  CellId,
  CELL_LENGTH,
  Coordinate,
  Duration,
  InputId,
  Room,
  Size,
  Timestamp
} from '../types';

export const ErrorLifecycle = {
  ERROR_CANNOT_ADD_INPUT_ALREADY_HAS_INPUT_OR_OUTPUT:
    'ERROR_CANNOT_ADD_INPUT_ALREADY_HAS_INPUT_OR_OUTPUT'
} as const;
export type ErrorLifecycle = typeof ErrorLifecycle;

export function sum(timestamp: Timestamp, duration: Duration): Timestamp;
export function sum(duration1: Duration, duration2: Duration): Duration;
export function sum(
  value1: Timestamp | Duration,
  value2: Duration
): Timestamp | Duration {
  // some nasty conversions
  return ((value1 as unknown as number) +
    (value2 as unknown as number)) as unknown as Timestamp | Duration;
}

export function coordToIndex(size: Size, coord: Coordinate): number {
  return coord.y * size.width + coord.x;
}

export function elapse(room: Room, timeDelta: Duration): Room {
  const timestampNew = sum(room.timestamp, timeDelta);

  room.timestamp = timestampNew;

  return room;
}

const BASE = 0b0_0000_000_0000000000;
const cellInputOutputMask = 0b1_0000_000_0000000000;
const cellInputOutputOffset = CELL_LENGTH;
export function cellHasInputOrOutput(cell: CellId): boolean {
  return (cell & cellInputOutputMask) >>> (cellInputOutputOffset - 1) === 1;
}

export function cellMarkHasInputOrOutput(cell: CellId): CellId {
  return cell | cellInputOutputMask;
}

export function cellMarkHasNoInputOrOutput(cell: CellId): CellId {
  return cell & ~cellInputOutputMask;
}

const inputIdMask = 0b1111;
const cellInputIdMask = 0b0_1111_000_0000000000;
const cellInputIdMaskOffset = CELL_LENGTH - 4;
export function cellSetInputId(cell: CellId, inputId: InputId): CellId {
  const cellWithoutId = cell & ~cellInputIdMask;
  const inputIdWithoutHead = inputId & inputIdMask;

  return cellWithoutId & (inputIdWithoutHead << (cellInputIdMaskOffset - 1));
}

export function addInput(
  room: Room,
  inputId: InputId,
  coord: Coordinate
): Either<
  ErrorLifecycle['ERROR_CANNOT_ADD_INPUT_ALREADY_HAS_INPUT_OR_OUTPUT'],
  Room
> {
  const index = coordToIndex(room.size, coord);

  const cell = room.cells[index];
  const hasInputOrOutput = cellHasInputOrOutput(cell);

  if (hasInputOrOutput) {
    return left(
      ErrorLifecycle.ERROR_CANNOT_ADD_INPUT_ALREADY_HAS_INPUT_OR_OUTPUT
    );
  }

  const cellWithInputId = cellSetInputId(cell, inputId);

  room.cells[index] = cellWithInputId;

  return right(room);
}
