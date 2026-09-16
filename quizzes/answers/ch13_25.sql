CREATE SEQUENCE order_id_seq
    START WITH 1000 INCREMENT BY 1 MAXVALUE 9999999 CACHE 20 NOCYCLE;

CREATE TABLE my_orders (
    order_id      NUMBER DEFAULT order_id_seq.NEXTVAL PRIMARY KEY,
    customer_name VARCHAR2(100) NOT NULL,
    product_name  VARCHAR2(100) NOT NULL,
    qty           NUMBER(5)    DEFAULT 1 CHECK (qty > 0),
    order_date    DATE         DEFAULT SYSDATE,
    status        VARCHAR2(20) DEFAULT 'PENDING'
                               CHECK (status IN ('PENDING','SHIPPED','CANCELLED'))
);

CREATE INDEX my_ord_status_idx ON my_orders(status);
CREATE INDEX my_ord_date_idx   ON my_orders(order_date);
CREATE SYNONYM mo FOR my_orders;

INSERT INTO mo (customer_name, product_name, qty)
VALUES ('김철수', 'Oracle 교재', 2);
INSERT INTO mo (customer_name, product_name, qty, status)
VALUES ('이영희', 'USB 허브', 1, 'SHIPPED');
INSERT INTO mo (customer_name, product_name)
VALUES ('박민준', '마우스');
COMMIT;

SELECT order_id, customer_name, product_name, qty, status, order_date
FROM   mo ORDER BY order_id;
