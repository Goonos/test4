SELECT worker.last_name        AS emp,
       manager.last_name       AS mgr,
       d.department_name,
       worker.salary
FROM   employees worker
JOIN   employees manager ON (worker.manager_id = manager.employee_id)
JOIN   departments d     ON (worker.department_id = d.department_id)
ORDER BY d.department_name, worker.last_name;
