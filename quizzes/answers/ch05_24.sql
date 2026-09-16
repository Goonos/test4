SELECT last_name,
       NVL2(commission_pct,
            TO_CHAR((salary * 12) + (salary * 12 * commission_pct), '$999,999'),
            'No Commission') AS commission_status
FROM   employees;
