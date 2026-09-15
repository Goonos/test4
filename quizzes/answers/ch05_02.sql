select employee_id, TO_CHAR(hire_date, 'fm MM/YY') as result
from employees
where last_name = 'Higgins'
/
