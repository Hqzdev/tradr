WITH primary_agents AS (
    SELECT DISTINCT ON (a.account_id)
           a.account_id,
           a.id AS agent_id,
           LEAST(ac.cash_balance, 75000.00 - w.initial_cash) AS top_up
    FROM agents a
    JOIN accounts ac ON ac.id = a.account_id
    JOIN agent_wallets w ON w.agent_id = a.id
    WHERE a.status <> 'ARCHIVED'
      AND w.initial_cash < 75000.00
      AND ac.cash_balance > 0
      AND w.initial_cash + LEAST(ac.cash_balance, 75000.00 - w.initial_cash) >= 1000.00
    ORDER BY a.account_id, a.created_at ASC
), funded_wallets AS (
    UPDATE agent_wallets w
    SET initial_cash = w.initial_cash + primary_agents.top_up,
        cash_balance = w.cash_balance + primary_agents.top_up
    FROM primary_agents
    WHERE w.agent_id = primary_agents.agent_id
      AND primary_agents.top_up > 0
    RETURNING w.agent_id, primary_agents.account_id, primary_agents.top_up, w.initial_cash, w.cash_balance, w.currency
), funded_accounts AS (
    UPDATE accounts ac
    SET cash_balance = ac.cash_balance - funded_wallets.top_up
    FROM funded_wallets
    WHERE ac.id = funded_wallets.account_id
    RETURNING funded_wallets.agent_id
)
UPDATE agent_configs c
SET budget = jsonb_build_object('limit', funded_wallets.initial_cash, 'currency', funded_wallets.currency)
FROM funded_wallets
JOIN funded_accounts ON funded_accounts.agent_id = funded_wallets.agent_id
WHERE c.agent_id = funded_wallets.agent_id;

INSERT INTO agent_equity_points (agent_id, cash_value, holdings_value, total_value)
SELECT w.agent_id,
       w.cash_balance,
       COALESCE(SUM(p.quantity * p.avg_price), 0),
       w.cash_balance + COALESCE(SUM(p.quantity * p.avg_price), 0)
FROM agent_wallets w
LEFT JOIN agent_positions p ON p.agent_id = w.agent_id
WHERE w.agent_id IN (
    SELECT DISTINCT ON (a.account_id) a.id
    FROM agents a
    WHERE a.status <> 'ARCHIVED'
    ORDER BY a.account_id, a.created_at ASC
)
GROUP BY w.agent_id, w.cash_balance;
