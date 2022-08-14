import { Either } from 'fp-ts/lib/Either';
import { Coordinate, Duration, Room, Size, Timestamp } from '../types';
import { ValueOf } from '../utils';
import { createEnum } from '../utils/createEnum';

export const ErrorLifecycle = createEnum([
  'ERROR_HAS_TRANSPUT_OR_OUTPUT',
  'ERROR_HAS_NO_TRANSPUT_OR_OUTPUT',
  'ERROR_TRANSPUT_ID_IS_TOO_BIG',
  'ERROR_INVALID_COORD'
] as const);

export type ErrorLifecycleMap = typeof ErrorLifecycle;
export type ErrorLifecycle = ValueOf<ErrorLifecycleMap>;

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

export function isCoordPositive(coord: Coordinate): boolean {
  return coord.x >= 0 && coord.y >= 0;
}

export function coordToIndex(size: Size, coord: Coordinate): number {
  return coord.y * size.width + coord.x;
}

export function elapse(room: Room, timeDelta: Duration): Room {
  const timestampNew = sum(room.timestamp, timeDelta);

  room.timestamp = timestampNew;

  return room;
}
