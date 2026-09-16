SELECT last_name,
       TO_CHAR(hire_date, 'fmDD Month YYYY')   AS hire_date_fmt,
       TO_NUMBER(TO_CHAR(SYSDATE, 'YYYY')) -
       TO_NUMBER(TO_CHAR(hire_date, 'YYYY'))   AS years,
       CASE
           WHEN TO_NUMBER(TO_CHAR(SYSDATE,'YYYY')) -
                TO_NUMBER(TO_CHAR(hire_date,'YYYY')) >= 30 THEN '30년+'
           WHEN TO_NUMBER(TO_CHAR(SYSDATE,'YYYY')) -
                TO_NUMBER(TO_CHAR(hire_date,'YYYY')) >= 20 THEN '20년+'
           WHEN TO_NUMBER(TO_CHAR(SYSDATE,'YYYY')) -
                TO_NUMBER(TO_CHAR(hire_date,'YYYY')) >= 10 THEN '10년+'
           ELSE '신입'
       END AS grade
FROM   employees
ORDER BY years DESC;
