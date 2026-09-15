select last_name, commission_pct, salary/10000 as sal,
NULLIF(commission_pct,salary/10000)
from employees
/
