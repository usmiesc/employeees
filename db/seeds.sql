use employees;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Manager', 25000, 1),
    ('Sales', 1000, 1),
    ('Lead', 500, 2),
    ('Software Engineer', 200000000, 2);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('michael', 'E', 1, NULL),
    ('Mike', 'Toe', 2, 1),
    ('Bob', 'Marley', 3, NULL);
    
