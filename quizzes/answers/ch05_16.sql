select last_name, NVL(TO_CHAR(manager_id),'owner')
from employees
/
