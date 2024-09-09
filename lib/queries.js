require('dotenv').config();

const { Client } = require('pg');
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

client.connect();

async function getDepartments() {
    const res = await client.query('SELECT * FROM department');
    console.table(res.rows);
}

async function getRoles() {
    const res = await client.query('SELECT * FROM role');
    console.table(res.rows);
}

async function getEmployees() {
    const res = await client.query('SELECT * FROM employee');
    console.table(res.rows);
}

// Add other functions for addDepartment, addRole, addEmployee, updateEmployeeRole

module.exports = {
    getDepartments,
    getRoles,
    getEmployees,
    // Export other functions as needed
};
