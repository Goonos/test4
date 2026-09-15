select last_name, NVL(TO_CHAR(salary*12*commission_pct, '$999,999'),'0') as result
from employees
/
