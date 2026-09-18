ALTER TABLE accounts
    ALTER COLUMN cash_balance SET DEFAULT 0.00;

UPDATE accounts
SET cash_balance = 0.00;
