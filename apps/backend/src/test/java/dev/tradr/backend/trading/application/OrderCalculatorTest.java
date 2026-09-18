package dev.tradr.backend.trading.application;

import dev.tradr.backend.trading.domain.OrderSide;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class OrderCalculatorTest {

    @Test
    void quantityDeterminesGrossAndRoundedBuyFee() {
        OrderCalculation calculation = calculate("9000", OrderAnchor.QUANTITY, "0,21", OrderSide.BUY);

        assertCalculation(calculation, "0.21000000", "1890.00", "1.89", "1891.89", true);
    }

    @Test
    void amountDeterminesSharesWithoutHiddenDisplayRounding() {
        OrderCalculation calculation = calculate("9000", OrderAnchor.AMOUNT, "1924,50", OrderSide.BUY);

        assertEquals("0,21383333", OrderCalculator.shares(calculation.quantity()));
        assertEquals(new BigDecimal("1924.50"), calculation.gross());
        assertEquals(new BigDecimal("1926.42"), calculation.total());
        assertEquals(calculation, calculate("9000", OrderAnchor.QUANTITY, OrderCalculator.shares(calculation.quantity()), OrderSide.BUY));
    }

    @Test
    void sellDeductsTheRoundedCommission() {
        assertEquals(new BigDecimal("1922.58"), calculate("192,45", OrderAnchor.QUANTITY, "10", OrderSide.SELL).total());
    }

    @Test
    void priceChangesPreserveTheSelectedAnchor() {
        assertEquals(new BigDecimal("2000.00"), calculate("200", OrderAnchor.QUANTITY, "10", OrderSide.BUY).gross());
        assertEquals(new BigDecimal("0.50000000"), calculate("200", OrderAnchor.AMOUNT, "100", OrderSide.BUY).quantity());
        assertEquals(new BigDecimal("0.40000000"), calculate("250", OrderAnchor.AMOUNT, "100", OrderSide.BUY).quantity());
    }

    @Test
    void liveQuoteChangesPreserveTheEnteredBudgetOrShareCount() {
        for (String price : List.of("192", "180", "210", "192")) {
            OrderCalculation budget = calculate(price, OrderAnchor.AMOUNT, "390", OrderSide.BUY);
            assertEquals(new BigDecimal("390.00"), budget.gross());
            assertEquals(new BigDecimal("390.39"), budget.total());
            assertTrue(budget.quantity().subtract(new BigDecimal("390").divide(new BigDecimal(price), 16, java.math.RoundingMode.HALF_UP)).abs().compareTo(new BigDecimal("0.00000001")) < 0);
            OrderCalculation shares = calculate(price, OrderAnchor.QUANTITY, "4", OrderSide.BUY);
            assertEquals(new BigDecimal("4.00000000"), shares.quantity());
            assertEquals(new BigDecimal(price).multiply(new BigDecimal("4")).setScale(2), shares.gross());
        }
        assertEquals(new BigDecimal("0.98958333"), calculate("192", OrderAnchor.AMOUNT, "190", OrderSide.BUY).quantity());
        assertEquals(new BigDecimal("2.03125000"), calculate("192", OrderAnchor.AMOUNT, "390", OrderSide.BUY).quantity());
    }

    @Test
    void invalidEmptyAndZeroEntriesCannotCreateValidQuotes() {
        for (String value : List.of("", ",", "0", "-1", "1,2,3", "Infinity", "1e3", "abc")) {
            assertFalse(calculate(value, OrderAnchor.QUANTITY, "10", OrderSide.BUY).valid());
            assertFalse(calculate("100", OrderAnchor.AMOUNT, value, OrderSide.BUY).valid());
        }
        assertTrue(OrderCalculator.accepts("1,", 2));
        assertTrue(OrderCalculator.accepts("1.25", 2));
        assertFalse(OrderCalculator.accepts("1.234", 2));
    }

    @Test
    void fractionalSharesAndCentBoundariesAreExact() {
        assertEquals(new BigDecimal("0.02"), calculate("0.10", OrderAnchor.QUANTITY, "0.15", OrderSide.BUY).gross());
        assertEquals(new BigDecimal("0.01"), calculate("5", OrderAnchor.QUANTITY, "1", OrderSide.BUY).commission());
        assertEquals("10", OrderCalculator.shares(new BigDecimal("10")));
        assertEquals("0,00000001", OrderCalculator.shares(new BigDecimal("0.00000001")));
        assertFalse(calculate("999999999", OrderAnchor.QUANTITY, "999999999", OrderSide.BUY).valid());
    }

    private OrderCalculation calculate(String price, OrderAnchor anchor, String value, OrderSide side) {
        return OrderCalculator.calculate(price, anchor, value, side);
    }

    private void assertCalculation(OrderCalculation calculation, String quantity, String gross, String commission, String total, boolean valid) {
        assertEquals(new BigDecimal(quantity), calculation.quantity());
        assertEquals(new BigDecimal(gross), calculation.gross());
        assertEquals(new BigDecimal(commission), calculation.commission());
        assertEquals(new BigDecimal(total), calculation.total());
        assertEquals(valid, calculation.valid());
    }
}
