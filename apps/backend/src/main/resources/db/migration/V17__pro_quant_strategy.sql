ALTER TABLE agents ALTER COLUMN risk_level TYPE VARCHAR(32);
ALTER TABLE agents DROP CONSTRAINT agents_strategy_check;
ALTER TABLE agents ADD CONSTRAINT agents_strategy_check
    CHECK (strategy IN ('AGGRESSIVE', 'CAREFUL', 'RANDOM', 'PRO_QUANT'));
