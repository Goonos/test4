select last_name, LPAD(ROUND(salary,3),10,'0') as formatted_sal
from employees
/
