ALTER TABLE agent_configs DROP CONSTRAINT agent_budget_shape_check;
ALTER TABLE agent_configs ADD CONSTRAINT agent_budget_shape_check CHECK (
    jsonb_typeof(budget) = 'object'
    AND budget ? 'limit'
    AND budget ? 'currency'
    AND (budget ->> 'limit')::numeric BETWEEN 1000.00 AND 1000000000000.00
    AND budget ->> 'currency' = 'USD'
);
