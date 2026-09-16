CREATE GLOBAL TEMPORARY TABLE tmp_order_staging
    (order_id   NUMBER,
     product_id NUMBER,
     quantity   NUMBER,
     unit_price NUMBER(10,2))
ON COMMIT DELETE ROWS;

SELECT table_name, temporary, duration
FROM   user_tables
WHERE  table_name = 'TMP_ORDER_STAGING';
