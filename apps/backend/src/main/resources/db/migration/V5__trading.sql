CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    instrument_id UUID NOT NULL REFERENCES instruments(id),
    side VARCHAR(8) NOT NULL,
    order_type VARCHAR(8) NOT NULL,
    quantity NUMERIC(18, 8) NOT NULL,
    limit_price NUMERIC(18, 4),
    status VARCHAR(12) NOT NULL,
    source VARCHAR(12) NOT NULL,
    source_agent_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    filled_at TIMESTAMPTZ,
    CONSTRAINT orders_side_check CHECK (side IN ('BUY', 'SELL')),
    CONSTRAINT orders_type_check CHECK (order_type IN ('MARKET', 'LIMIT')),
    CONSTRAINT orders_status_check CHECK (status IN ('OPEN', 'FILLED', 'CANCELLED')),
    CONSTRAINT orders_source_check CHECK (source IN ('MANUAL', 'AGENT')),
    CONSTRAINT orders_limit_price_check CHECK (
        (order_type = 'MARKET' AND limit_price IS NULL)
        OR (order_type = 'LIMIT' AND limit_price IS NOT NULL)
    )
);

CREATE INDEX orders_account_created_at_idx ON orders (account_id, created_at DESC);
CREATE INDEX orders_instrument_status_created_at_idx ON orders (instrument_id, status, created_at);

CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id),
    account_id UUID NOT NULL REFERENCES accounts(id),
    instrument_id UUID NOT NULL REFERENCES instruments(id),
    side VARCHAR(8) NOT NULL,
    quantity NUMERIC(18, 8) NOT NULL,
    price NUMERIC(18, 4) NOT NULL,
    commission NUMERIC(18, 2) NOT NULL,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT trades_side_check CHECK (side IN ('BUY', 'SELL'))
);

CREATE INDEX trades_account_executed_at_idx ON trades (account_id, executed_at DESC);
CREATE INDEX trades_account_instrument_executed_at_idx ON trades (account_id, instrument_id, executed_at DESC);

CREATE TABLE positions (
    account_id UUID NOT NULL REFERENCES accounts(id),
    instrument_id UUID NOT NULL REFERENCES instruments(id),
    quantity NUMERIC(18, 8) NOT NULL,
    avg_price NUMERIC(18, 4) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (account_id, instrument_id),
    CONSTRAINT positions_quantity_check CHECK (quantity > 0)
);
