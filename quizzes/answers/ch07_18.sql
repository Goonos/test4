SELECT worker.last_name  AS emp,
       mgr1.last_name    AS direct_mgr,
       mgr2.last_name    AS manager_of_mgr
FROM   employees worker
JOIN   employees mgr1 ON (worker.manager_id = mgr1.employee_id)
JOIN   employees mgr2 ON (mgr1.manager_id   = mgr2.employee_id)
ORDER BY worker.last_name;
