select last_name, salary, commission_pct,
COALESCE(salary+(salary*commission_pct), salary+500) result
from employees
/
