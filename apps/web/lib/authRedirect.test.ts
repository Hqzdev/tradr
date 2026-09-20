import assert from "node:assert/strict";
import test from "node:test";
import { authPath, safeNextPath, safeNextPathOrNull } from "./authRedirect.ts";

test("keeps safe local paths including query and hash", () => {
  assert.equal(safeNextPathOrNull("/market/AAPL?tab=orders#open"), "/market/AAPL?tab=orders#open");
});

test("rejects external and protocol-relative redirects", () => {
  assert.equal(safeNextPathOrNull("https://example.com"), null);
  assert.equal(safeNextPathOrNull("//example.com"), null);
  assert.equal(safeNextPath("https://example.com"), "/dashboard");
});

test("encodes safe auth destinations", () => {
  assert.equal(authPath("/login", "/agents/123"), "/login?next=%2Fagents%2F123");
  assert.equal(authPath("/register", null), "/register");
});
