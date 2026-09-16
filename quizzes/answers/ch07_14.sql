SELECT   manager.last_name AS manager, COUNT(*) AS sub_count
FROM     employees worker
JOIN     employees manager
ON       (worker.manager_id = manager.employee_id)
GROUP BY manager.last_name
ORDER BY sub_count DESC;
