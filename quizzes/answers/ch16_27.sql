WITH org_tree (employee_id, last_name, manager_id, lvl) AS (
    -- 앵커 멤버: 최상위 관리자
    SELECT employee_id, last_name, manager_id, 1 AS lvl
    FROM   employees
    WHERE  manager_id IS NULL
    UNION ALL
    -- 재귀 멤버: 상위 직원의 부하 직원
    SELECT e.employee_id, e.last_name, e.manager_id, ot.lvl + 1
    FROM   employees e
    JOIN   org_tree  ot ON (e.manager_id = ot.employee_id)
)
SELECT employee_id, last_name, manager_id, lvl
FROM   org_tree
ORDER BY lvl, manager_id NULLS FIRST, employee_id;
