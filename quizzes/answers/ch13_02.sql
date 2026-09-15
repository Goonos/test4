select sequence_name, min_value, max_value,
       increment_by, cache_size, cycle_flag, last_number
from user_sequences
where sequence_name = 'DEPT_ID_SEQ'
/
