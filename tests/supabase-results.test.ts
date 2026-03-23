import assert from "node:assert/strict";
import test from "node:test";
import { assertNoSupabaseError, assertSupabaseRecord } from "../lib/supabase/results";

test("assertNoSupabaseError returns data when no error exists", () => {
  const data = assertNoSupabaseError({
    data: { ok: true },
    error: null,
  });

  assert.deepEqual(data, { ok: true });
});

test("assertNoSupabaseError throws when Supabase returns an error", () => {
  assert.throws(() =>
    assertNoSupabaseError({
      data: null,
      error: { message: "insert failed" },
    })
  );
});

test("assertSupabaseRecord throws when the row is missing", () => {
  assert.throws(() =>
    assertSupabaseRecord({
      data: null,
      error: null,
    })
  );
});

test("assertSupabaseRecord returns the record when it exists", () => {
  const record = assertSupabaseRecord({
    data: { unsubscribe_token: "token-123" },
    error: null,
  });

  assert.equal(record.unsubscribe_token, "token-123");
});
