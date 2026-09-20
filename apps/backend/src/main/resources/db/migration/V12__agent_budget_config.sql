UPDATE agent_configs
SET budget = '{"limit": 100000.00, "currency": "USD"}'::jsonb
WHERE budget = '{}'::jsonb OR NOT (budget ? 'limit');

ALTER TABLE agent_configs
    ADD CONSTRAINT agent_budget_shape_check CHECK (
        jsonb_typeof(budget) = 'object'
        AND budget ? 'limit'
        AND budget ? 'currency'
        AND (budget ->> 'limit')::numeric BETWEEN 1000.00 AND 100000.00
        AND budget ->> 'currency' = 'USD'
    );
