select last_name, salary, commission_pct, (salary*12)+(salary*12*NVL(commission_pct,0))
from employees
/
