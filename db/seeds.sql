-- seeds.sql

-- Insert departments
INSERT INTO department (name) VALUES ('Sales'), ('Engineering'), ('Marketing');

-- Insert roles
INSERT INTO role (title, salary, department_id) VALUES
('Sales Manager', 60000, (SELECT id FROM department WHERE name='Sales')),
('Software Engineer', 80000, (SELECT id FROM department WHERE name='Engineering')),
('Marketing Coordinator', 50000, (SELECT id FROM department WHERE name='Marketing'));

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id) VALUES
('John', 'Doe', (SELECT id FROM role WHERE title='Sales Manager')),
('Jane', 'Smith', (SELECT id FROM role WHERE title='Software Engineer')),
('Mary', 'Johnson', (SELECT id FROM role WHERE title='Marketing Coordinator'));
