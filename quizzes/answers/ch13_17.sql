CREATE TABLE prod_orders (
    order_id    NUMBER(10)
        PRIMARY KEY USING INDEX
        (CREATE INDEX prod_ord_pk_idx ON prod_orders(order_id)),
    product_name VARCHAR2(100) NOT NULL,
    qty         NUMBER(5) DEFAULT 1
);
