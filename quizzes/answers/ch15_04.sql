ALTER TABLE emp2
ADD CONSTRAINT emp2_mgr_fk
    FOREIGN KEY (manager_id)
    REFERENCES emp2(employee_id);

-- 자기 참조 확인: manager_id = 100인 직원
SELECT employee_id, manager_id
FROM   emp2
WHERE  manager_id = 100
FETCH FIRST 5 ROWS ONLY;
