//The following imports all required packages for the application
const inquirer = require('inquirer');
const mysql = require('mysql2/promise')

require("dotenv").config();
//Call my environmental variables
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
//This calls the dbEmployee function when the app is initiated
async function dbEmployee(userAction) {
    try {
        const db = await mysql.createConnection({
            host: "localhost",
            user: dbUser,
            password: dbPassword,
            database: dbName,
        });

        let dbRows = [];
        let userOutput = [];
        // This starts the switch case for the user to select an action
        switch (userAction) {
            //This displays all the departments and the information included in that
            case "View departments":
                dbRows = await db.query("SELECT * FROM department");
                console.table(dbRows[0]);
                break;

            //This displays all the roles and the information included in that
            case "View roles":
                dbRows = await db.query(`
                SELECT
                role.id,
                role.title,
                role.salary,
                department.name AS department
                FROM role
                JOIN department ON role.department_id = department_id
                `);
                console.table(dbRows[0]);
                break;


            //This displays all the employees and the information included in each
            case "View employees":
                dbRows = await db.query(`
                SELECT
                employee.id,
                employee.first_name,
                employee.last_name,
                role.title AS title,
                department.name AS department,
                role.salary AS salary,
                CASE WHEN employee.manager_id IS NOT NULL THEN CONCAT(manager_table.first_name,'', manager_table.last_name) ELSE NULL END AS MANAGER FROM employee
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
                JOIN employee manager_table ON employee.manager_id = manager_table.id
                `)
                console.table(dbRows[0]);
                break;
            //This allows the user to add a department by inputing the user output into the department
            case "Add department":
                userOutput = await inquirer.prompt([
                    {
                        name: "department",
                        message: "Please enter a new Department",
                    },
                ]);
                try {
                    dbRows = await db.query(
                        `INSERT INTO department (name) VALUES ('${userOutput.department}');`
                    );
                } catch (err) {
                    console.log("Error creating department");
                }

                break;


            //This allows the user to add a role by entering a role title, salary for the position, and department
            case "Add role":

                userOutput = await inquirer.prompt([
                    {
                        name: "title",
                        message: "Enter New Role:",
                    },
                    {
                        name: "salary",
                        message: "Enter Role Salary:",
                    },
                    {
                        name: "titleDpt",
                        message: "Enter Role Department:",
                    },
                ]);



                const { title, salary, titleDept } = userOutput;

                //This selects an id from the department title
                const deptId = await db.query(
                    `SELECT COALESCE((SELECT id FROM department WHERE name = "${titleDept}"), "Department Does Not Exist")`
                );


                const [rows] = deptId;
                const department_id = Object.values(rows[0])[0];


                if (department_id === "Department Does Not Exist") {
                    console.log("Enter title of an Existing Department!");
                    break;
                }

                //this inserts the user input into the role table
                dbRows = await db.query(
                    ` INSERT INTO role (title, salary, department_id) VALUES ('${title}', '${salary}', '${department_id}');`
                );


                break;

            //This allows the user to add a new employee by entering a name, role and manager
            case "Add employee":
                userOutput = await inquirer.prompt([
                    {
                        name: "first_name",
                        message: "Enter Employee's First Name:",
                    },
                    {
                        name: "last_name",
                        message: "Enter Employee's Last Name:",
                    },
                    {
                        name: "role",
                        message: "Enter Employee's title:",
                    },
                    {
                        name: "manager",
                        message: "Enter Employee's Manager:",
                    },
                ]);



                const allRoles = await db.query("select * from role;");
                const allManagers = await db.query(
                    "SELECT * FROM employee where manager_id is null;"
                );

                const { first_name, last_name, role, manager } = userOutput;
                // This assigns the inital index of roles to the role_data variable
                const role_data = allRoles[0].filter((rol) => {
                    return rol.title === role;
                });
                // This assigns the inital index of managers to manager_data variable
                const manager_data = allManagers[0].filter((man) => {
                    return `${man.first_name} ${man.last_name}` === manager;
                });

                if (role_data.length === 0) {
                    console.log("Role not found. Please enter a valid role.");
                    break;
                }

                if (manager_data.length === 0) {
                    console.log("Manager not found. Please enter a valid manager.");
                    break;
                }
                //This inserts the new data into the employee table
                dbRows = await db.query(
                    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${role_data[0].id}, ${manager_data[0].id})`
                );

                break;

            //this case allows the user to change the employee title
            case "Change Employee title":
                //This grabs the data from the employee table
                existingEmployees = await db.query(`
                                SELECT id, first_name, last_name FROM employee;`);
                //This grabs the existing titles from the role table
                existingTitles = await db.query(`
                                SELECT id, title FROM role;`);
                //This iterates over each instance of the employee array and displays their name and employee id
                const allEmployees = existingEmployees[0].map((employee) => {
                    return {
                        name: `${employee["first_name"]} ${employee.last_name}`,
                        value: employee.id,
                    };
                });
                //This iterates over each instance of the role array and displays the title name and role id
                const titles = existingTitles[0].map((role) => {
                    return {
                        name: role.title,
                        value: role.id,
                    };
                });
                //The following allows the user to choose an employee and title
                userOutput = await inquirer.prompt([
                    {
                        type: "list",
                        name: "employeeId",
                        message: "Choose Which Employee to Update:",
                        choices: allEmployees,
                    },
                    {
                        type: "list",
                        name: "newRole",
                        message: "Please Enter Employee's New Role:",
                        choices: titles,
                    },
                ]);




                dbRows = await db.query(`
                                    UPDATE employee
                                    SET role_id = ${userOutput.newRole}
                                    WHERE employee.id = ${userOutput.employeeId};`);

                break;
        };
    } catch (err) {
        console.log(err);
    };

};



function userPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Please select an action",
            choices: [
                "View departments",
                "View roles",
                "View employees",
                "Add department",
                "Add role",
                "Add employee",
                "Change employee title",
                new inquirer.Separator(),
                "Quit",
            ],
        },
    ])
        .then(async (res) => {
            await dbEmployee(res.action);
            res.action === "Quit" ? process.exit() : userPrompt();
        })
        .catch((err) => {
            //Check if the error is related to the terminal
            if (err.isTtyError) {
            } else {
                err;
            }
        });
}
userPrompt();