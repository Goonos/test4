select TO_CHAR(hire_date, 'YYYY'), count(employee_id)
from employees
group by hire_date
/
