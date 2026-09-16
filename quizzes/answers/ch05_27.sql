SELECT employee_id,
       last_name,
       TO_CHAR(
           NVL2(commission_pct,
                salary * 12 * (1 + commission_pct),
                salary * 12 + 1000),
           '$999,999') AS total_comp_fmt
FROM   employees
ORDER BY NVL2(commission_pct,
              salary * 12 * (1 + commission_