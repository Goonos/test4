-- 허용된 열 수정 (성공)
UPDATE hr.departments
SET    department_name = 'Sales Updated'
WHERE  department_id = 80;

-- 허용되지 않은 열 수정 (오류)
UPDATE hr.departments
SET    manager_id = 100
WHERE  department_id = 80;
