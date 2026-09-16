SELECT i.table_name, i.index_name, i.uniqueness, i.index_type,
       c.column_name, c.column_position
FROM   user_indexes     i
JOIN   user_ind_columns c ON i.index_name = c.index_name
ORDER BY i.table_name, i.index_name, c.column_position;
