-- 1단계: 부서 90번 직원 급여 5% 인상
UPDATE empl7 SET salary = salary * 1.05 WHERE department_id = 90;

SAVEPOINT after_update;

-- 2단계: 직원 없는 부서 삭제
DELETE FROM dept7 d
WHERE NOT EXISTS (SELECT NULL FROM empl7 e WHERE e.department_id = d.department_id);

-- 3단계: 2단계(DELETE)만 취소
ROLLBACK TO after_update;
