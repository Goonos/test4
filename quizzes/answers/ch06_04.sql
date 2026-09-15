select AVG(salary) avg_sal, MAX(salary) max_sal, MIN(salary) min_sal, SUM(salary) sum_sal
from employees
where job_id LIKE '%REP%'
/
