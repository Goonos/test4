select last_name, job_id, salary,
    decode(job_id,
    'IT_PROG',  salary * 1.1,
    'ST_CLERK', salary * 1.15,
    'SA_REP',   salary * 1.2,
    salary) AS sal)
from employees
/