import assert from "node:assert/strict";
import test from "node:test";
import { OrderCalculator as Calculator } from "./OrderCalculator.ts";

test("quantity determines gross and rounded buy fee", () => {
  assert.deepEqual(Calculator.calculate("9000", "quantity", "0,21", "buy"), {
    quantity: 0.21, gross: 1890, commission: 1.89, total: 1891.89, valid: true,
  });
});

test("amount determines shares without hidden display rounding", () => {
  const quote = Calculator.calculate("9000", "amount", "1924,50", "buy");
  assert.equal(Calculator.shares(quote.quantity), "0,21383333");
  assert.equal(quote.gross, 1924.5);
  assert.equal(quote.total, 1926.42);
  assert.deepEqual(Calculator.calculate("9000", "quantity", Calculator.shares(quote.quantity), "buy"), quote);
});

test("sell deducts the rounded commission", () => {
  assert.equal(Calculator.calculate("192,45", "quantity", "10", "sell").total, 1922.58);
});

test("price changes preserve the selected anchor", () => {
  assert.equal(Calculator.calculate("200", "quantity", "10", "buy").gross, 2000);
  assert.equal(Calculator.calculate("200", "amount", "100", "buy").quantity, 0.5);
  assert.equal(Calculator.calculate("250", "amount", "100", "buy").quantity, 0.4);
});

test("live quote changes preserve the entered budget or share count", () => {
  for (const price of ["192", "180", "210", "192"]) {
    const budget = Calculator.calculate(price, "amount", "390", "buy");
    assert.equal(budget.gross, 390);
    assert.equal(budget.total, 390.39);
    assert.ok(Math.abs(budget.quantity - 390 / Number(price)) < 0.00000001);
    const shares = Calculator.calculate(price, "quantity", "4", "buy");
    assert.equal(shares.quantity, 4);
    assert.equal(shares.gross, Number(price) * 4);
  }
  assert.equal(Calculator.calculate("192", "amount", "190", "buy").quantity, 0.98958333);
  assert.equal(Calculator.calculate("192", "amount", "390", "buy").quantity, 2.03125);
});

test("invalid, empty and zero entries cannot create valid quotes", () => {
  for (const value of ["", ",", "0", "-1", "1,2,3", "Infinity", "1e3", "abc"]) {
    assert.equal(Calculator.calculate(value, "quantity", "10", "buy").valid, false);
    assert.equal(Calculator.calculate("100", "amount", value, "buy").valid, false);
  }
  assert.equal(Calculator.accepts("1,", 2), true);
  assert.equal(Calculator.accepts("1.25", 2), true);
  assert.equal(Calculator.accepts("1.234", 2), false);
});

test("fractional shares and cent boundaries are exact", () => {
  assert.equal(Calculator.calculate("0.10", "quantity", "0.15", "buy").gross, 0.02);
  assert.equal(Calculator.calculate("5", "quantity", "1", "buy").commission, 0.01);
  assert.equal(Calculator.shares(10), "10");
  assert.equal(Calculator.shares(0.00000001), "0,00000001");
  assert.equal(Calculator.calculate("999999999", "quantity", "999999999", "buy").valid, false);
});
