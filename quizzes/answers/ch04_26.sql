select last_name, hire_date, Trunc(MONTHS_BETWEEN(sysdate,hire_date)) as result
from employees
/
