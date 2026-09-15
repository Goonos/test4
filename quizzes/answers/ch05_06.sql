select last_name, hire_date, 'Q' || TO_CHAR(hire_date,'Q') as result
from employees
/
