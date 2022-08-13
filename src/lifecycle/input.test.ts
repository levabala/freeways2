import assert from 'node:assert';
import test, { describe, it } from 'node:test';
import {
  cellHasInputOrOutput,
  cellMarkHasInputOrOutput,
  cellMarkHasNoInputOrOutput
} from './all';

describe('input', () => {
  test('has input or output bit', () => {
    const cell1 = 0b0_1001_010_0111000001;
    assert.equal(cellHasInputOrOutput(cell1), false);

    const cell2 = 0b0_0000_000_0000000000;
    assert.equal(cellHasInputOrOutput(cell2), false);

    const cell3 = 0b1_0000_000_0000000000;
    assert.equal(cellHasInputOrOutput(cell3), true);

    const cell4 = 0b1_1111_111_1111111111;
    assert.equal(cellHasInputOrOutput(cell4), true);
  });

  test('mark as input or output', () => {
    const cell1 = cellMarkHasInputOrOutput(0b0_1001_010_0111000001);
    assert.equal(cellHasInputOrOutput(cell1), true);

    const cell2 = cellMarkHasInputOrOutput(0b1_1001_010_0111000001);
    assert.equal(cellHasInputOrOutput(cell2), true);
  });

  test('mark as not input or output', () => {
    const cell1 = cellMarkHasNoInputOrOutput(0b0_1001_010_0111000001);
    assert.equal(cellHasInputOrOutput(cell1), false);

    const cell2 = cellMarkHasNoInputOrOutput(0b1_1001_010_0111000001);
    assert.equal(cellHasInputOrOutput(cell2), false);
  });
});
