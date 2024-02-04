use employee_db
-- This uses the employee_db characteristics defined in the schema file to outline the rules associated with each value type

-- depts
INSERT INTO department (name)
VALUES ('Residential Design'),
('Commercial Design'),
('Construction'),
('Interior Design'),

-- roles
INSERT INTO role (title, salary, department_id)
VALUES ('Residential Senior Architect', 125000, 1),
('Residential Junior Architect', 100000, 1),
('Residential Designer', 65000, 1),
('Commercial Senior Architect', 135000, 2),
('Commercial Junior Architect', 110000, 2),
('Commercial Designer', 70000, 2),
('Construction Manager', 130000, 3),
('Journeyman', 80000, 3),
('Electrician', 80000, 3),
('Plumber', 80000, 3),
('Framer', 60000, 3),
('Painter', 60000, 3),
('General Laborer', 45000, 3),
('Senior Interior Designer', 75000, 4),
('Junior Interior Designer', 55000, 4),
('Designer', 45000, 4)

-- employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Frank", "Gehry",  1, NULL),
("Zaha", "Hadid", 2, 1),
("Frank", "Wright", 3, 1),
("Antoni", "Gaudi", 4, NULL),
("Louis", "Sullivan", 5, 4),
("Adrian", "Smith", 6, 4),
("Kazuyo, Sejima", 7, NULL),
("Miles", "Van Der Rohe", 8, 7),
("Jeanne", "Gang", 9, 7),
("Norman", "Foster", 10, 7),
("Philip", "Johnson", 11, 7),
("Amanda", "Levete", 12, 7),
("Gabriela", "Carillo", 13, 7)
("Maya", "Lin", 14, NULL),
("Tadao", "Ando", 15, 14),
("Renzo", "Piano", 16, 14),

