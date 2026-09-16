CREATE SEQUENCE emp_id_seq
    START WITH 300
    INCREMENT BY 1
    MAXVALUE 9999
    NOCACHE
    NOCYCLE;

CREATE TABLE new_employees (
    emp_id   NUMBER DEFAULT emp_id_seq.NEXTVAL NOT NULL,
    emp_name VARCHAR2(50) NOT NULL,
    hire_date DATE DEFAULT SYSDATE
);

INSERT INTO new_employees (emp_name) VALUES ('Kim Chulsoo');
INSERT INTO new_employees (emp_name) VALUES ('Lee Younghee');
INSERT INTO new_employees (emp_name) VALUES ('Park Minjun');

SELECT * FROM new_employees;
