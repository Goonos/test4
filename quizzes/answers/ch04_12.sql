select last_name, UPPER(substr(last_name,1,8)||'_US') as RESULT
from employees
/
