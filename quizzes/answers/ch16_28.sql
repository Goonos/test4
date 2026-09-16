WITH org_tree (employee_id, last_name, manager_id, lvl) AS (
    SELECT employee_id, last_name, manager_id, 1 AS lvl
    FROM   employees
    WHERE  manager_id IS NULL
    UNION ALL
    SELECT e.employee_id, e.last_name, e.manager_id, ot.lvl + 1
    FROM   employees e
    JOIN   org_tree  ot ON (e.manager_id = ot.employee_id)
)
SELECT employee_id,
       LPAD(' ', (lvl - 1) * 3, ' ') || last_name AS org_chart,
       lvl
FROM   org_tree
ORDER BY lvl, manager_id NULLS FIRST, employee_id;
