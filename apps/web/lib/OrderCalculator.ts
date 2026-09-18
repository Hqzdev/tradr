export type OrderAnchor = "quantity" | "amount";

export class OrderCalculator {
  static accepts(value: string, decimals: number): boolean {
    return new RegExp(`^\\d{0,9}([.,]\\d{0,${decimals}})?$`).test(value);
  }

  static money(value: number): string {
    return value.toFixed(2).replace(".", ",");
  }

  static shares(value: number): string {
    return value.toFixed(8).replace(/\.?0+$/, "").replace(".", ",") || "0";
  }

  private static units(value: string, decimals: number): bigint {
    if (!this.accepts(value, decimals)) return BigInt(0);
    const [whole, fraction = ""] = value.replace(",", ".").split(".");
    return BigInt((whole || "0") + fraction.padEnd(decimals, "0"));
  }

  static calculate(priceText: string, anchor: OrderAnchor, input: string, side: "buy" | "sell") {
    const scale = BigInt(100000000);
    const price = this.units(priceText, 2);
    const entered = this.units(input, anchor === "quantity" ? 8 : 2);
    const quantity = anchor === "quantity" ? entered : price > BigInt(0) ? entered * scale / price : BigInt(0);
    const cents = (price * quantity + scale / BigInt(2)) / scale;
    const fee = (cents + BigInt(500)) / BigInt(1000);
    const total = side === "buy" ? cents + fee : cents - fee;
    const valid = price > BigInt(0) && quantity > BigInt(0) && cents > BigInt(0)
      && total <= BigInt(Number.MAX_SAFE_INTEGER) && quantity <= BigInt(Number.MAX_SAFE_INTEGER);
    return {
      quantity: Number(quantity) / Number(scale),
      gross: Number(cents) / 100,
      commission: Number(fee) / 100,
      total: Number(total) / 100,
      valid,
    };
  }
}
