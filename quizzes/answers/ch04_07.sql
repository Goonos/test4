select  last_name,RPAD(substr(last_name,1,5),5,'_')||employee_id as ID_CODE
from employees
/
