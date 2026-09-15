select last_name, salary, commission_pct, NVL(commission_pct,0) as result
from employees
/
