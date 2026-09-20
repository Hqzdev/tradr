ALTER TABLE accounts
    ADD COLUMN initial_balance NUMERIC(18, 2) NOT NULL DEFAULT 100000.00,
    ADD COLUMN goal_value NUMERIC(18, 2) NOT NULL DEFAULT 110000.00,
    ADD COLUMN acceleration_enabled BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE agents DROP CONSTRAINT agents_status_check;
ALTER TABLE agents ADD CONSTRAINT agents_status_check CHECK (status IN ('ACTIVE', 'PAUSED', 'ERROR', 'ARCHIVED'));

CREATE TABLE agent_wallets (
    agent_id UUID PRIMARY KEY REFERENCES agents(id) ON DELETE CASCADE,
    initial_cash NUMERIC(18, 2) NOT NULL,
    cash_balance NUMERIC(18, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    CONSTRAINT agent_wallet_cash_check CHECK (initial_cash >= 0 AND cash_balance >= 0)
);

CREATE TABLE agent_positions (
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    instrument_id UUID NOT NULL REFERENCES instruments(id),
    quantity NUMERIC(18, 8) NOT NULL,
    avg_price NUMERIC(18, 4) NOT NULL,
    opened_step BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (agent_id, instrument_id),
    CONSTRAINT agent_positions_quantity_check CHECK (quantity > 0)
);

CREATE TABLE agent_market_states (
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    instrument_id UUID NOT NULL REFERENCES instruments(id),
    last_trade_step BIGINT NOT NULL,
    PRIMARY KEY (agent_id, instrument_id)
);

CREATE TABLE agent_equity_points (
    id BIGSERIAL PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    cash_value NUMERIC(18, 2) NOT NULL,
    holdings_value NUMERIC(18, 2) NOT NULL,
    total_value NUMERIC(18, 2) NOT NULL,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX agent_equity_points_agent_time_idx ON agent_equity_points (agent_id, captured_at DESC);

-- Existing users without an agent receive a paused owner for their legacy positions.
INSERT INTO agents (account_id, name, strategy, status, risk_level, trigger_percent)
SELECT DISTINCT p.account_id, 'Стартовый агент', 'CAREFUL', 'PAUSED', '-2% ... +2%', -1.00
FROM positions p
WHERE NOT EXISTS (SELECT 1 FROM agents a WHERE a.account_id = p.account_id);

INSERT INTO agent_configs (agent_id, character, budget, skills)
SELECT a.id,
       '{"name":"Осторожный","minimumChange":-2,"maximumChange":2,"signal":-1}'::jsonb,
       '{"limit":100000.00,"currency":"USD"}'::jsonb,
       '{}'::jsonb
FROM agents a
WHERE NOT EXISTS (SELECT 1 FROM agent_configs c WHERE c.agent_id = a.id);

INSERT INTO agent_wallets (agent_id, initial_cash, cash_balance, currency)
SELECT id, 0, 0, 'USD' FROM agents;

INSERT INTO agent_positions (agent_id, instrument_id, quantity, avg_price, opened_step)
SELECT owner.id, p.instrument_id, p.quantity, p.avg_price, 0
FROM positions p
JOIN LATERAL (
    SELECT a.id FROM agents a
    WHERE a.account_id = p.account_id
    ORDER BY a.created_at ASC
    LIMIT 1
) owner ON TRUE;

UPDATE agent_wallets w
SET initial_cash = legacy.cost
FROM (
    SELECT agent_id, ROUND(SUM(quantity * avg_price), 2) AS cost
    FROM agent_positions
    GROUP BY agent_id
) legacy
WHERE legacy.agent_id = w.agent_id;

INSERT INTO agent_equity_points (agent_id, cash_value, holdings_value, total_value)
SELECT agent_id, cash_balance, initial_cash, cash_balance + initial_cash FROM agent_wallets;

UPDATE orders SET status = 'CANCELLED'
WHERE source = 'MANUAL' AND status = 'OPEN';

DROP TABLE positions;
