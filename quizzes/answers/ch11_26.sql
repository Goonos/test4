-- 데이터 삽입
INSERT INTO customers (customer_id, customer_name, email)
VALUES (1, '김철수', 'chulsoo@email.com');

INSERT INTO customers (customer_id, customer_name, email, grade)
VALUES (2, '이영희', 'younghee@email.com', 'GOLD');

INSERT INTO products VALUES (1001, 'Oracle DB 교재', 45000, 100);
INSERT INTO products VALUES (1002, 'USB 허브', 29000, 50);

INSERT INTO orders VALUES (1, 1, 1001, SYSDATE, 2, 90000);
INSERT INTO orders VALUES (2, 2, 1002, SYSDATE, 1, 29000);
COMMIT;

-- A) grade = 'PLATINUM' → CHECK 위반
INSERT INTO customers (customer_id, customer_name, email, grade)
VALUES (3, '박민준', 'mj@email.com', 'PLATINUM');
-- ORA-02290: check constraint violated
-- 원인: grade CHECK 조건은 'BRONZE','SILVER','GOLD'만 허용

-- B) quantity = -1 → CHECK 위반
INSERT INTO orders VALUES (3, 1, 1001, SYSDATE, -1, -45000);
-- ORA-02290: check constraint violated
-- 원인: quantity CHECK (quantity > 0) 조건 위반
