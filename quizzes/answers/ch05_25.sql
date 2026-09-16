SELECT last_name, department_id,
       DECODE(department_id,
              10, '본사',
              20, '마케팅',
              30, '구매',
              60, 'IT',
              80, '영업',
              90, '경영진',
              '기타부서') AS dept_name
FROM   employees
ORDER BY department_id;
