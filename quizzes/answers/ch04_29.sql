select last_name, hire_date, TRUNC(MONTHS_BETWEEN(sysdate, hire_date)) as days ,
CASE 
WHEN MONTHS_BETWEEN(sysdate,hire_date) >=360 THEN '30+'
WHEN MONTHS_BETWEEN(sysdate,hire_date) >=240 THEN '20~30'
WHEN MONTHS_BETWEEN(sysdate,hire_date) >=120 THEN '10~20'
ELSE 'under 10'
END AS Grade
from employees
order by days
/
