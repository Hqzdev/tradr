ALTER TABLE agent_decision_logs
    DROP COLUMN IF EXISTS simulation_id;

DROP TABLE IF EXISTS simulation_results;
DROP TABLE IF EXISTS simulations;
DROP TABLE IF EXISTS simulation_datasets;
