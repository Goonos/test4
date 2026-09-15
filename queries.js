// queries.js
const SQL_QUERIES = {
    ts01: 
        `
-- 변경 전 인덱스: (STATUS, CREATED_AT)
-- 변경 후 인덱스: (CREATED_AT, STATUS)
SELECT /*+ INDEX(p idx_payment_created_status) */ * FROM payment p 
WHERE created_at >= '2026-01-01' AND status = 'COMPLETED'
-- 변경 전 인덱스: (STATUS, CREATED_AT)
-- 변경 후 인덱스: (CREATED_AT, STATUS)
SELECT /*+ INDEX(p idx_payment_created_status) */ * FROM payment p 
WHERE created_at >= '2026-01-01' AND status = 'COMPLETED'
-- 변경 전 인덱스: (STATUS, CREATED_AT)
-- 변경 후 인덱스: (CREATED_AT, STATUS)
SELECT /*+ INDEX(p idx_payment_created_status) */ * FROM payment p 
WHERE created_at >= '2026-01-01' AND status = 'COMPLETED'
-- 변경 전 인덱스: (STATUS, CREATED_AT)
-- 변경 후 인덱스: (CREATED_AT, STATUS)
SELECT /*+ INDEX(p idx_payment_created_status) */ * FROM payment p 
WHERE created_at >= '2026-01-01' AND status = 'COMPLETED'
-- 변경 전 인덱스: (STATUS, CREATED_AT)
-- 변경 후 인덱스: (CREATED_AT, STATUS)
SELECT /*+ INDEX(p idx_payment_created_status) */ * FROM payment p 
WHERE created_at >= '2026-01-01' AND status = 'COMPLETED'
-- 변경 전 인덱스: (STATUS, CREATED_AT)
-- 변경 후 인덱스: (CREATED_AT, STATUS)
SELECT /*+ INDEX(p idx_payment_created_status) */ * FROM payment p 
WHERE created_at >= '2026-01-01' AND status = 'COMPLETED'
-- 변경 전 인덱스: (STATUS, CREATED_AT)
-- 변경 후 인덱스: (CREATED_AT, STATUS)
SELECT /*+ INDEX(p idx_payment_created_status) */ * FROM payment p 
WHERE created_at >= '2026-01-01' AND status = 'COMPLETED'
          `,

    ts02: `SELECT * FROM some_large_table WHERE condition = true;`,
    ts03: `SELECT * FROM some_large_table WHERE condition = true;`,
    
    // 앞으로 추가될 긴 쿼리들은 여기에 계속 나열하면 됩니다.
};
