ALTER TABLE accounts
    ALTER COLUMN cash_balance SET DEFAULT 100000.00;

UPDATE accounts
SET cash_balance = 100000.00;
