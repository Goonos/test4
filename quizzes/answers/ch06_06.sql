select avg(commission_pct), avg(NVL(commission_pct,0))
from employees
/
