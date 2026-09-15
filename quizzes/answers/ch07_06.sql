select job_title, max_salary, MAX(salary) as max_sal
from employees
JOIN jobs USING(job_id)
group by job_title, max_salary
order by job_title
/
