import assert from "node:assert/strict";
import test from "node:test";
import { HeroAgentDecisionEngine } from "./HeroAgentDecisionEngine.ts";
import { stockCatalog } from "./stocks.ts";

const engine = new HeroAgentDecisionEngine();

test("rejects empty, invalid, too small and excessive budgets", () => {
  assert.equal(engine.evaluate(stockCatalog.AAPL, "", "random").error, "empty");
  assert.equal(engine.evaluate(stockCatalog.AAPL, "abc", "random").error, "invalid");
  assert.equal(engine.evaluate(stockCatalog.AAPL, "100", "random").error, "too-small");
  assert.equal(engine.evaluate(stockCatalog.AAPL, "1000001", "random").error, "too-large");
});

test("returns a stable educational decision with whole share quantity", () => {
  const first = engine.evaluate(stockCatalog.NVDA, "2500", "aggressive");
  const second = engine.evaluate(stockCatalog.NVDA, "2500", "aggressive");

  assert.deepEqual(first, second);
  assert.equal(first.error, null);
  assert.equal(first.decision?.action, "buy");
  assert.equal(first.decision?.quantity, 16);
  assert.ok((first.decision?.confidence ?? 0) >= 50);
  assert.ok((first.decision?.confidence ?? 0) <= 91);
});

test("agent strategies react differently to the same weak signal", () => {
  assert.equal(engine.evaluate(stockCatalog.KO, "1000", "cautious").decision?.action, "wait");
  assert.notEqual(engine.evaluate(stockCatalog.KO, "1000", "aggressive").decision?.action, "wait");
  assert.deepEqual(
    engine.evaluate(stockCatalog.KO, "1000", "random"),
    engine.evaluate(stockCatalog.KO, "1000", "random"),
  );
});
