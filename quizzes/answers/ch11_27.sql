ALTER TABLE products
ADD (category VARCHAR2(30) DEFAULT 'GENERAL');

ALTER TABLE products
MODIFY (product_name VARCHAR2(200));

ALTER TABLE products
MODIFY (stock_qty NUMBER(6) DEFAULT 0);

DESCRIBE products;
