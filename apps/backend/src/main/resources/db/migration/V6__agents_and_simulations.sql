CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    strategy VARCHAR(16) NOT NULL,
    status VARCHAR(12) NOT NULL,
    risk_level VARCHAR(12) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT agents_strategy_check CHECK (strategy IN ('AGGRESSIVE', 'CAREFUL', 'RANDOM')),
    CONSTRAINT agents_status_check CHECK (status IN ('ACTIVE', 'PAUSED', 'ERROR'))
);

CREATE INDEX agents_account_status_idx ON agents (account_id, status);

CREATE TABLE agent_configs (
    agent_id UUID PRIMARY KEY REFERENCES agents(id) ON DELETE CASCADE,
    character JSONB NOT NULL DEFAULT '{}'::jsonb,
    budget JSONB NOT NULL DEFAULT '{}'::jsonb,
    skills JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE simulation_datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(160) NOT NULL,
    source VARCHAR(16) NOT NULL,
    instrument_id UUID NOT NULL REFERENCES instruments(id),
    range_start TIMESTAMPTZ NOT NULL,
    range_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    name VARCHAR(160) NOT NULL,
    dataset_id UUID REFERENCES simulation_datasets(id),
    mode VARCHAR(12) NOT NULL,
    status VARCHAR(12) NOT NULL,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    CONSTRAINT simulations_mode_check CHECK (mode IN ('BACKTEST', 'LIVE')),
    CONSTRAINT simulations_status_check CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED'))
);

CREATE INDEX simulations_account_created_idx ON simulations (account_id, started_at DESC);

CREATE TABLE simulation_results (
    simulation_id UUID PRIMARY KEY REFERENCES simulations(id) ON DELETE CASCADE,
    metrics JSONB NOT NULL,
    equity_curve JSONB NOT NULL
);

CREATE TABLE agent_decision_logs (
    id BIGSERIAL PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    simulation_id UUID REFERENCES simulations(id) ON DELETE CASCADE,
    ts TIMESTAMPTZ NOT NULL DEFAULT now(),
    action VARCHAR(8) NOT NULL,
    reason TEXT NOT NULL,
    rules_evaluated JSONB NOT NULL,
    related_order_id UUID REFERENCES orders(id),
    CONSTRAINT agent_decision_logs_action_check CHECK (action IN ('BUY', 'SELL', 'WAIT'))
);

CREATE INDEX agent_decision_logs_agent_ts_idx ON agent_decision_logs (agent_id, ts DESC);
