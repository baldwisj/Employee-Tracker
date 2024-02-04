DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

use employee_db;

CREATE TABLE department(
    id INT NIT NULL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role(
    id INT NOT NULL INT PRIMARY KEY,
    title VARCHAR(30),
    salary Decimal,
    department_id INT,
    FOREIGN KEY (department_id),
    References department(id)

);

CREATE TABLE employee(
    id INT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    REFERENCES role(id),
    REFERENCES employee(id),
    FOREIGN KEY (manager_id),
    FOREIGN KEY (role_id)
);
