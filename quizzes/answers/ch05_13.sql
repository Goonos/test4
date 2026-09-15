select last_name, salary, NVL2(commission_pct,'commission','No commission') as result
from employees
/
