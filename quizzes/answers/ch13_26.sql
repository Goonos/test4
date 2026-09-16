SELECT sequence_name, last_number, increment_by, cache_size
FROM   user_sequences WHERE sequence_name = 'ORDER_ID_SEQ';

SELECT index_name, uniqueness FROM user_indexes WHERE table_name = 'MY_ORDERS';

SELECT synonym_name, table_name FROM user_synonyms WHERE synonym_name = 'MO';
