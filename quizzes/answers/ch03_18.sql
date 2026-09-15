select last_name, salary, commission_pct
from employees
where (salary <5000 OR salary>15000) OR commission_pct >=0.4
order by salary DESC
/
