SELECT order_id_seq.NEXTVAL FROM dual;  -- 1003

INSERT INTO mo (customer_name, product_name) VALUES ('테스트1', '상품A');  -- 1004
INSERT INTO mo (customer_name, product_name) VALUES ('테스트2', '상품B');  -- 1005
INSERT INTO mo (customer_name, product_name) VALUES ('테스트3', '상품C');  -- 1006
SELECT order_id_seq.CURRVAL FROM dual;  -- 1006
ROLLBACK; 

SELECT order_id_seq.NEXTVAL FROM dual; 

SELECT order_id FROM mo ORDER BY order_id;
