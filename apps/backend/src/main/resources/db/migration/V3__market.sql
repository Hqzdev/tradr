CREATE TABLE instruments (
    id UUID PRIMARY KEY,
    ticker VARCHAR(16) NOT NULL UNIQUE,
    name VARCHAR(160) NOT NULL,
    exchange VARCHAR(64) NOT NULL,
    type VARCHAR(16) NOT NULL,
    currency CHAR(3) NOT NULL,
    base_price NUMERIC(18, 4) NOT NULL
);

CREATE TABLE candles (
    id BIGSERIAL PRIMARY KEY,
    instrument_id UUID NOT NULL REFERENCES instruments(id),
    timeframe VARCHAR(16) NOT NULL,
    bucket_start TIMESTAMPTZ NOT NULL,
    open NUMERIC(18, 4) NOT NULL,
    high NUMERIC(18, 4) NOT NULL,
    low NUMERIC(18, 4) NOT NULL,
    close NUMERIC(18, 4) NOT NULL,
    volume BIGINT NOT NULL,
    CONSTRAINT candles_instrument_timeframe_bucket_key UNIQUE (instrument_id, timeframe, bucket_start)
);

CREATE INDEX candles_instrument_timeframe_bucket_start_idx
    ON candles (instrument_id, timeframe, bucket_start DESC);

CREATE TABLE index_quotes (
    id UUID PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    display_value VARCHAR(32) NOT NULL,
    change_percent NUMERIC(8, 4) NOT NULL,
    sort_order SMALLINT NOT NULL UNIQUE,
    updated_at TIMESTAMPTZ NOT NULL
);

INSERT INTO instruments (id, ticker, name, exchange, type, currency, base_price) VALUES
    ('00000000-0000-0000-0000-000000000001', 'AAPL', 'Apple Inc.', 'NASDAQ', 'STOCK', 'USD', 192.4500),
    ('00000000-0000-0000-0000-000000000002', 'NVDA', 'NVIDIA Corporation', 'NASDAQ', 'STOCK', 'USD', 138.7200),
    ('00000000-0000-0000-0000-000000000003', 'TSLA', 'Tesla, Inc.', 'NASDAQ', 'STOCK', 'USD', 247.1800),
    ('00000000-0000-0000-0000-000000000004', 'MSFT', 'Microsoft Corporation', 'NASDAQ', 'STOCK', 'USD', 428.7600),
    ('00000000-0000-0000-0000-000000000005', 'AMZN', 'Amazon.com, Inc.', 'NASDAQ', 'STOCK', 'USD', 186.4200),
    ('00000000-0000-0000-0000-000000000006', 'GOOGL', 'Alphabet Inc.', 'NASDAQ', 'STOCK', 'USD', 167.2800);

INSERT INTO index_quotes (id, name, display_value, change_percent, sort_order, updated_at) VALUES
    ('00000000-0000-0000-0000-000000000101', 'S&P 500', '5 782,76', 0.6400, 1, CURRENT_TIMESTAMP),
    ('00000000-0000-0000-0000-000000000102', 'NASDAQ', '18 271,32', 1.1200, 2, CURRENT_TIMESTAMP),
    ('00000000-0000-0000-0000-000000000103', 'DOW JONES', '42 628,18', -0.1800, 3, CURRENT_TIMESTAMP);
