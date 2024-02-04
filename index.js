//The following imports all required packages for the application
const inquirer = require('inquirer');
const mysql = require('mysql2/promise')

require("dotenv").config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

async function dbEmployee() {
    try{
        const db = await mysql.createConnection({
            host: "localhost",
            user: user,
            password: password,
            database: name,
        });
    }
}


function userPrompt() {
    inquirer.prompt([
        {

        }

    
    ])
}
userPrompt();