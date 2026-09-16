CREATE VIEW job_avg_sal_vu
AS SELECT job_id, AVG(salary) avg_salary
   FROM   employees
   GROUP BY job_id
   HAVING AVG(salary) >= 8000;
