ALTER TABLE agents
    ADD COLUMN trigger_percent NUMERIC(5,2);

UPDATE agents
SET trigger_percent = CASE strategy
    WHEN 'AGGRESSIVE' THEN (ARRAY[-5,-4,-3,-2,-1,1,2,3])[floor(random() * 8 + 1)::INTEGER]
    WHEN 'CAREFUL' THEN (ARRAY[-2,-1,1,2])[floor(random() * 4 + 1)::INTEGER]
    WHEN 'RANDOM' THEN (ARRAY[-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8])[floor(random() * 16 + 1)::INTEGER]
END;

ALTER TABLE agents
    ALTER COLUMN trigger_percent SET NOT NULL;
