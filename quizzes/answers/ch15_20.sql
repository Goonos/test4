INSERT INTO tmp_order_staging VALUES (1001, 301, 5, 29.99);
INSERT INTO tmp_order_staging VALUES (1001, 302, 2, 49.99);
INSERT INTO tmp_order_staging VALUES (1002, 301, 1, 29.99);

-- COMMIT 전: 3건 조회됨
SELECT * FROM tmp_order_staging;  -- 3 rows

COMMIT;

SELECT * FROM tmp_order_staging;
