SELECT worker.last_name  AS emp,
       manager.last_name AS mgr
FROM   employees worker
JOIN   employees manager
ON     (worker.manager_id = manager.employee_id)
ORDER BY worker.last_name;
