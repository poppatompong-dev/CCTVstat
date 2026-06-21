import assert from "node:assert/strict";
import test from "node:test";

import {
  hasCanonicalMasterOrder,
  moveMasterId,
  nextMasterSortOrder,
  normalizeMasterOrder,
} from "./master-order";

test("moveMasterId moves the dragged item to the drop target", () => {
  assert.deepEqual(moveMasterId([10, 20, 30, 40], 30, 10), [30, 10, 20, 40]);
  assert.deepEqual(moveMasterId([10, 20, 30, 40], 10, 40), [20, 30, 40, 10]);
});

test("normalizeMasterOrder assigns one-based contiguous positions", () => {
  assert.deepEqual(normalizeMasterOrder([10, 20, 30], [30, 10, 20]), [
    { id: 30, sortOrder: 1 },
    { id: 10, sortOrder: 2 },
    { id: 20, sortOrder: 3 },
  ]);
});

test("normalizeMasterOrder rejects duplicate ids", () => {
  assert.throws(
    () => normalizeMasterOrder([10, 20, 30], [10, 20, 20]),
    /must contain every master item exactly once/,
  );
});

test("normalizeMasterOrder rejects missing or unknown ids", () => {
  assert.throws(
    () => normalizeMasterOrder([10, 20, 30], [10, 20]),
    /must contain every master item exactly once/,
  );
  assert.throws(
    () => normalizeMasterOrder([10, 20, 30], [10, 20, 99]),
    /must contain every master item exactly once/,
  );
});

test("nextMasterSortOrder appends after the greatest existing position", () => {
  assert.equal(nextMasterSortOrder([]), 1);
  assert.equal(nextMasterSortOrder([1, 4, 4]), 5);
});

test("hasCanonicalMasterOrder detects duplicates and gaps", () => {
  assert.equal(hasCanonicalMasterOrder([]), true);
  assert.equal(hasCanonicalMasterOrder([1, 2, 3]), true);
  assert.equal(hasCanonicalMasterOrder([1, 2, 2]), false);
  assert.equal(hasCanonicalMasterOrder([1, 3, 4]), false);
});
