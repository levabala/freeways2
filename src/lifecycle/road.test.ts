import { isLeft, isRight } from 'fp-ts/lib/Either';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { c } from './coordinate';
import { ErrorLifecycle } from './errors';
import { addRoadLevel, hasRoadLevel } from './road';
import { createEmptyRoom } from './room';

describe('road', () => {
  it('add level', () => {
    const room = createEmptyRoom({ width: 1, height: 1 });

    const roomResult = addRoadLevel(room, 0, c(0, 0));

    assert(isRight(roomResult));
    assert.deepStrictEqual(
      roomResult.right.cells[0],
      0b0_0_0000_001_0000000000
    );
  });

  it('add level invalid coord', () => {
    const room = createEmptyRoom({ width: 1, height: 1 });

    const roomResult = addRoadLevel(room, 0, c(1, 0));

    assert(isLeft(roomResult));
    assert.deepStrictEqual(roomResult.left, ErrorLifecycle.ERROR_INVALID_COORD);
  });

  it('add level invalid coord', () => {
    const room = createEmptyRoom({ width: 1, height: 1 });

    const roomResult = addRoadLevel(room, 6, c(0, 0));

    assert(isLeft(roomResult));
    assert.deepStrictEqual(
      roomResult.left,
      ErrorLifecycle.ERROR_TOO_HIGH_ROAD_LEVEL
    );
  });

  it('add level already placed', () => {
    const room = createEmptyRoom({ width: 1, height: 1 });

    const roomResult = addRoadLevel(room, 0, c(0, 0));

    assert(isRight(roomResult));

    const roomResult2 = addRoadLevel(room, 0, c(0, 0));

    assert(isLeft(roomResult2));
    assert.deepStrictEqual(
      roomResult2.left,
      ErrorLifecycle.ERROR_ROAD_ALREADY_PLACED
    );
  });

  it('has level', () => {
    const room = createEmptyRoom({ width: 1, height: 1 });

    const roadLevelResult1 = hasRoadLevel(room, 0, c(0, 0));

    assert(isRight(roadLevelResult1));
    assert(roadLevelResult1.right === false);

    const roomResult = addRoadLevel(room, 0, c(0, 0));

    assert(isRight(roomResult));

    const roadLevelResult2 = hasRoadLevel(room, 0, c(0, 0));

    assert(isRight(roadLevelResult2));
    assert(roadLevelResult2.right);
  });

  it('has level invalid coord', () => {
    const room = createEmptyRoom({ width: 1, height: 1 });

    const roadLevelResult = hasRoadLevel(room, 0, c(1, 0));

    assert(isLeft(roadLevelResult));
    assert.deepStrictEqual(
      roadLevelResult.left,
      ErrorLifecycle.ERROR_INVALID_COORD
    );
  });

  it('has level invalid coord', () => {
    const room = createEmptyRoom({ width: 1, height: 1 });

    const roadLevelResult = hasRoadLevel(room, 6, c(0, 0));

    assert(isLeft(roadLevelResult));
    assert.deepStrictEqual(
      roadLevelResult.left,
      ErrorLifecycle.ERROR_TOO_HIGH_ROAD_LEVEL
    );
  });
});
