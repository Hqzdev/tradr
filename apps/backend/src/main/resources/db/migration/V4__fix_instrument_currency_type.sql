ALTER TABLE instruments
    ALTER COLUMN currency TYPE VARCHAR(3)
    USING currency::VARCHAR(3);
