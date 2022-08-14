import { left, right } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { Cell, Coordinate, MAX_ROAD_LEVEL, RoadLevel, Room } from '../types';
import { ErrorLifecycle } from './errors';
import { setCell } from './room';
import { coordToIndex, isCoordValid } from './utils';

const cellRoadMask = 0b0_0_0000_111_0000000000;
const cellRoadOffset = Math.log2(cellRoadMask & -cellRoadMask);
function cellIsRoadLevelPlaced(cell: Cell, level: RoadLevel) {
  return cell >>> (cellRoadOffset + level) === 1;
}

const cellPlaceRoadLevel = (level: RoadLevel) => (cell: Cell) => {
  const roadLevelMask = 1 << (cellRoadOffset + level);

  return cell | roadLevelMask;
};

export function addRoadLevel(room: Room, level: RoadLevel, coord: Coordinate) {
  if (isCoordValid(room, coord)) {
    return left(ErrorLifecycle.ERROR_INVALID_COORD);
  }

  if (level > MAX_ROAD_LEVEL) {
    return left(ErrorLifecycle.ERROR_TOO_HIGH_ROAD_LEVEL);
  }

  const index = coordToIndex(room.size, coord);
  const cell = room.cells[index];

  const placedResult = cellIsRoadLevelPlaced(cell, level);

  if (placedResult) {
    return left(ErrorLifecycle.ERROR_ROAD_ALREADY_PLACED);
  }

  return right(pipe(cell, cellPlaceRoadLevel(level), setCell(room, index)));
}

export function hasRoadLevel(room: Room, level: RoadLevel, coord: Coordinate) {
  if (isCoordValid(room, coord)) {
    return left(ErrorLifecycle.ERROR_INVALID_COORD);
  }

  if (level > MAX_ROAD_LEVEL) {
    return left(ErrorLifecycle.ERROR_TOO_HIGH_ROAD_LEVEL);
  }

  const index = coordToIndex(room.size, coord);
  const cell = room.cells[index];

  return right(cellIsRoadLevelPlaced(cell, level));
}
