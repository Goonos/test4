select job_id from employees
UNION
select job_id from job_history
order by job_id

/
