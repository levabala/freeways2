import { Cell, Room, Size, toTimestamp } from '../types';

export function createEmptyRoom(size: Size): Room {
  return {
    cells: new Uint32Array(size.width * size.height),
    size,
    timestamp: toTimestamp(0)
  };
}

export const setCell = (room: Room, index: number) => (cell: Cell) => {
  room.cells[index] = cell;

  return room;
};
