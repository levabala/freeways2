import { isLeft, isRight } from 'fp-ts/lib/Either';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { Room, TransputType } from '../types';
import { createEmptyRoom } from './room';
import { ErrorLifecycle } from './errors';
import { addTransput, getTransputType, removeTransput } from './transput';

describe('transput', () => {
  it('add/remove transput normal', () => {
    const room: Room = createEmptyRoom({ width: 1, height: 1 });
    const roomResult = addTransput(room, 0b0001, TransputType.Input, {
      x: 0,
      y: 0
    });

    assert(isRight(roomResult));
    assert.deepStrictEqual(
      roomResult.right.cells[0],
      0b1_0_0001_000_0000000000
    );

    const roomResult2 = removeTransput(roomResult.right, { x: 0, y: 0 });

    assert(isRight(roomResult2));
    assert.deepStrictEqual(
      roomResult2.right.cells[0],
      0b0_0_0000_000_0000000000
    );
  });

  it('transput type input', () => {
    const room: Room = createEmptyRoom({ width: 1, height: 1 });
    const roomResult1 = addTransput(room, 0b0001, TransputType.Input, {
      x: 0,
      y: 0
    });

    assert(isRight(roomResult1));

    const roomResult2 = getTransputType(roomResult1.right, { x: 0, y: 0 });

    assert(isRight(roomResult2));
    assert.strictEqual(roomResult2.right, TransputType.Input);
  });

  it('transput type output', () => {
    const room: Room = createEmptyRoom({ width: 1, height: 1 });
    const roomResult1 = addTransput(room, 0b0001, TransputType.Output, {
      x: 0,
      y: 0
    });

    assert(isRight(roomResult1));

    const roomResult2 = getTransputType(roomResult1.right, { x: 0, y: 0 });

    assert(isRight(roomResult2));
    assert.strictEqual(roomResult2.right, TransputType.Output);
  });

  it('get transput type invalid coord', () => {
    const room: Room = createEmptyRoom({ width: 1, height: 1 });
    const roomResult1 = getTransputType(room, {
      x: 4,
      y: 0
    });

    assert(isLeft(roomResult1));
    assert.strictEqual(roomResult1.left, ErrorLifecycle.ERROR_INVALID_COORD);
  });

  it('add/remove transput invalid coord', () => {
    const room: Room = createEmptyRoom({ width: 3, height: 2 });
    const roomResult1 = addTransput(room, 0b0001, TransputType.Input, {
      x: 4,
      y: 0
    });
    const roomResult2 = addTransput(room, 0b0001, TransputType.Input, {
      x: 2,
      y: 4
    });
    const roomResult3 = addTransput(room, 0b0001, TransputType.Input, {
      x: 1,
      y: -1
    });
    const roomResult4 = removeTransput(room, { x: 4, y: 0 });
    const roomResult5 = removeTransput(room, { x: 2, y: 4 });
    const roomResult6 = removeTransput(room, { x: 1, y: -1 });

    assert(isLeft(roomResult1));
    assert(isLeft(roomResult2));
    assert(isLeft(roomResult3));
    assert(isLeft(roomResult4));
    assert(isLeft(roomResult5));
    assert(isLeft(roomResult6));

    assert.strictEqual(roomResult1.left, ErrorLifecycle.ERROR_INVALID_COORD);
    assert.strictEqual(roomResult2.left, ErrorLifecycle.ERROR_INVALID_COORD);
    assert.strictEqual(roomResult3.left, ErrorLifecycle.ERROR_INVALID_COORD);
    assert.strictEqual(roomResult4.left, ErrorLifecycle.ERROR_INVALID_COORD);
    assert.strictEqual(roomResult5.left, ErrorLifecycle.ERROR_INVALID_COORD);
    assert.strictEqual(roomResult6.left, ErrorLifecycle.ERROR_INVALID_COORD);
  });

  it('add transput transput id is too big', () => {
    const room: Room = createEmptyRoom({ width: 3, height: 2 });
    const roomResult = addTransput(room, 0b10000, TransputType.Input, {
      x: 2,
      y: 0
    });

    assert(isLeft(roomResult));

    assert.strictEqual(
      roomResult.left,
      ErrorLifecycle.ERROR_TRANSPUT_ID_IS_TOO_BIG
    );
  });

  it('add transput already has transput or output', () => {
    const room: Room = createEmptyRoom({ width: 3, height: 2 });
    const roomWithTransput = addTransput(room, 0b0001, TransputType.Input, {
      x: 2,
      y: 0
    });

    assert(isRight(roomWithTransput));

    const roomResult = addTransput(
      roomWithTransput.right,
      0b0011,
      TransputType.Input,
      {
        x: 2,
        y: 0
      }
    );

    assert(isLeft(roomResult));
    assert.strictEqual(
      roomResult.left,
      ErrorLifecycle.ERROR_ALREADY_HAS_TRANSPUT_OR_OUTPUT
    );
  });

  it('remove transput already has no transput or output', () => {
    const room: Room = createEmptyRoom({ width: 3, height: 2 });
    const roomResult = removeTransput(room, { x: 2, y: 0 });

    assert(isLeft(roomResult));
    assert.strictEqual(
      roomResult.left,
      ErrorLifecycle.ERROR_ALREADY_HAS_NO_TRANSPUT_OR_OUTPUT
    );
  });
});
