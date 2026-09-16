SELECT last_name,
       TO_CHAR(hire_date, 'YYYY') AS hire_year,
       DECODE(TO_CHAR(hire_date, 'YYYY'),
              '1987', '원년 멤버',
              '1989', '초기 멤버',
              '일반 멤버') AS member_type
FROM   employees
WHERE  department_id = 90;
