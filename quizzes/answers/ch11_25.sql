-- 1. customers 테이블
CREATE TABLE customers (
    customer_id   NUMBER(6)    PRIMARY KEY,
    customer_name VARCHAR2(50) NOT NULL,
    email         VARCHAR2(50) UNIQUE NOT NULL,
    join_date     DATE         DEFAULT SYSDATE,
    grade         VARCHAR2(10) DEFAULT 'BRONZE'
                               CHECK (grade IN ('BRONZE','SILVER','GOLD'))
);

-- 2. products 테이블
CREATE TABLE products (
    product_id   NUMBER(8)    PRIMARY KEY,
    product_name VARCHAR2(100) NOT NULL,
    price        NUMBER(10,2) CHECK (price > 0),
    stock_qty    NUMBER(6)    DEFAULT 0 CHECK (stock_qty >= 0)
);

-- 3. orders 테이블 (FK: customers, products 먼저 생성 후 실행)
CREATE TABLE orders (
    order_id    NUMBER(10)   PRIMARY KEY,
    customer_id NUMBER(6)    REFERENCES customers(customer_id),
    product_id  NUMBER(8)    REFERENCES products(product_id),
    order_date  DATE         DEFAULT SYSDATE,
    quantity    NUMBER(4)    CHECK (quantity > 0),
    total_price NUMBER(12,2)
);
