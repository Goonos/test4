SELECT e1.last_name AS emp1, e2.last_name AS emp2,
       e1.job_id, e1.department_id
FROM   employees e1
JOIN   employees e2
ON     (e1.department_id = e2.department_id
        AND e1.job_id = e2.job_id
        AND e1.employee_id < e2.employee_id)
WHERE  e1.department_id = 80
ORDER BY e1.last_name, e2.last_name;
