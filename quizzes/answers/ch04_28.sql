select last_name, hire_date, NEXT_DAY(hire_date,'mon')as result
from employees
/
