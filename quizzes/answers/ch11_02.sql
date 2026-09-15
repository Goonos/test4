create table my_employees(
	emp_id		NUMBER(6) Primary key,
	first_name 	VARCHAR2(20),
	last_name	VARCHAR2(25) NOT NULL,
	email 		VARCHAR2(25) NOT NULL UNIQUE,
	hire_date	DATE DEFAULT sysdate,
	salary 		NUMBER(8,2) CHECK(salary > 0),
	dept_id NUMBER(4),
	CONSTRAINT fk_my_demp_dept Foreign KEY (dept_id) REferences mydepartments(dept_id)
)
/
