CREATE VIEW emp_dept_vu
AS SELECT e.employee_id,
          e.last_name,
          d.department_name,
          l.city
   FROM   employees   e
   JOIN   departments d USING (department_id)
   JOIN   locations   l USING (location_id);
