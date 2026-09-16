COMMENT ON TABLE employees
IS '인사 관리 시스템 - 전체 사원 정보 저장 테이블';

COMMENT ON COLUMN employees.employee_id
IS '사원 고유 식별번호 (기본 키)';

COMMENT ON COLUMN employees.first_name
IS '사원 이름 (영문)';

COMMENT ON COLUMN employees.salary
IS '월 기본급 (단위: USD)';
