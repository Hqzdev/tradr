WITH starter AS (
    SELECT DISTINCT ON (a.account_id)
           a.account_id,
           a.id AS agent_id,
           LEAST(ac.cash_balance, 25000.00) AS allocation
    FROM agents a
    JOIN accounts ac ON ac.id = a.account_id
    JOIN agent_wallets w ON w.agent_id = a.id
    WHERE w.initial_cash = 0
      AND ac.cash_balance >= 1000.00
      AND a.status <> 'ARCHIVED'
    ORDER BY a.account_id, a.created_at ASC
), funded_wallets AS (
    UPDATE agent_wallets w
    SET initial_cash = starter.allocation,
        cash_balance = starter.allocation
    FROM starter
    WHERE w.agent_id = starter.agent_id
    RETURNING w.agent_id, starter.account_id, starter.allocation
)
UPDATE accounts ac
SET cash_balance = ac.cash_balance - funded_wallets.allocation
FROM funded_wallets
WHERE ac.id = funded_wallets.account_id;

UPDATE agent_configs c
SET budget = jsonb_build_object('limit', GREATEST(w.initial_cash, 1000.00), 'currency', w.currency)
FROM agent_wallets w
WHERE c.agent_id = w.agent_id;

INSERT INTO agent_equity_points (agent_id, cash_value, holdings_value, total_value)
SELECT w.agent_id, w.cash_balance, 0, w.cash_balance
FROM agent_wallets w
WHERE w.initial_cash > 0
  AND NOT EXISTS (SELECT 1 FROM agent_equity_points p WHERE p.agent_id = w.agent_id);
