package dev.tradr.backend.trading.application;

import dev.tradr.backend.trading.domain.OrderSide;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.util.regex.Pattern;

public final class OrderCalculator {

    private static final BigInteger QUANTITY_SCALE = BigInteger.valueOf(100_000_000L);
    private static final BigInteger FEE_DIVISOR = BigInteger.valueOf(1_000L);
    private static final BigInteger MAX_SAFE_INTEGER = BigInteger.valueOf(9_007_199_254_740_991L);

    private OrderCalculator() {
    }

    public static boolean accepts(String value, int decimals) {
        return Pattern.compile("^\\d{0,9}([.,]\\d{0," + decimals + "})?$").matcher(value).matches();
    }

    public static String money(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP).toPlainString().replace('.', ',');
    }

    public static String shares(BigDecimal value) {
        String formatted = value.setScale(8, RoundingMode.HALF_UP).stripTrailingZeros().toPlainString().replace('.', ',');
        return formatted.equals("0") ? "0" : formatted;
    }

    public static OrderCalculation calculate(String priceText, OrderAnchor anchor, String input, OrderSide side) {
        BigInteger price = units(priceText, 2);
        BigInteger entered = units(input, anchor == OrderAnchor.QUANTITY ? 8 : 2);
        BigInteger quantity = anchor == OrderAnchor.QUANTITY
                ? entered
                : price.signum() > 0 ? entered.multiply(QUANTITY_SCALE).divide(price) : BigInteger.ZERO;
        BigInteger cents = price.multiply(quantity).add(QUANTITY_SCALE.divide(BigInteger.TWO)).divide(QUANTITY_SCALE);
        BigInteger commission = cents.add(BigInteger.valueOf(500)).divide(FEE_DIVISOR);
        BigInteger total = side == OrderSide.BUY ? cents.add(commission) : cents.subtract(commission);
        boolean valid = price.signum() > 0
                && quantity.signum() > 0
                && cents.signum() > 0
                && total.compareTo(MAX_SAFE_INTEGER) <= 0
                && quantity.compareTo(MAX_SAFE_INTEGER) <= 0;
        return new OrderCalculation(
                new BigDecimal(quantity, 8),
                new BigDecimal(cents, 2),
                new BigDecimal(commission, 2),
                new BigDecimal(total, 2),
                valid
        );
    }

    private static BigInteger units(String value, int decimals) {
        if (!accepts(value, decimals)) {
            return BigInteger.ZERO;
        }
        String[] parts = value.replace(',', '.').split("\\.", -1);
        String whole = parts[0].isEmpty() ? "0" : parts[0];
        String fraction = parts.length == 2 ? parts[1] : "";
        return new BigInteger(whole + fraction + "0".repeat(decimals - fraction.length()));
    }
}
