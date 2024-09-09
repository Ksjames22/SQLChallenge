require('dotenv').config();
const { Client } = require('pg');
const inquirer = require('inquirer'); // Add this line
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
    const res = await client.query(`
        SELECT role.id, role.title, role.salary, department.name AS department
        FROM role
        JOIN department ON role.department_id = department.id
    `);
    console.table(res.rows);
}

async function getEmployees() {
    const res = await client.query(`
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id
    `);
    console.table(res.rows);
}

async function addDepartment() {
    const { name } = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter department name:'
    });
    await client.query('INSERT INTO department (name) VALUES ($1)', [name]);
}

async function addRole() {
    const { title, salary, department } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter role title:' },
        { type: 'input', name: 'salary', message: 'Enter role salary:' },
        { type: 'input', name: 'department', message: 'Enter department name:' }
    ]);

    const deptRes = await client.query('SELECT id FROM department WHERE name = $1', [department]);
    if (deptRes.rows.length === 0) throw new Error('Department not found');

    await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, deptRes.rows[0].id]);
}

async function addEmployee() {
    const { firstName, lastName, role, manager } = await inquirer.prompt([
        { type: 'input', name: 'firstName', message: 'Enter employee first name:' },
        { type: 'input', name: 'lastName', message: 'Enter employee last name:' },
        { type: 'input', name: 'role', message: 'Enter role title:' },
        { type: 'input', name: 'manager', message: 'Enter manager’s first name (optional):' }
    ]);

    const roleRes = await client.query('SELECT id FROM role WHERE title = $1', [role]);
    if (roleRes.rows.length === 0) throw new Error('Role not found');

    let managerId = null;
    if (manager) {
        const managerRes = await client.query('SELECT id FROM employee WHERE first_name = $1', [manager]);
        if (managerRes.rows.length === 0) throw new Error('Manager not found');
        managerId = managerRes.rows[0].id;
    }

    await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleRes.rows[0].id, managerId]);
}

async function updateEmployeeRole() {
    const { employee, role } = await inquirer.prompt([
        { type: 'input', name: 'employee', message: 'Enter employee’s first name:' },
        { type: 'input', name: 'role', message: 'Enter new role title:' }
    ]);

    const empRes = await client.query('SELECT id FROM employee WHERE first_name = $1', [employee]);
    if (empRes.rows.length === 0) throw new Error('Employee not found');

    const roleRes = await client.query('SELECT id FROM role WHERE title = $1', [role]);
    if (roleRes.rows.length === 0) throw new Error('Role not found');

    await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleRes.rows[0].id, empRes.rows[0].id]);
}

module.exports = {
    getDepartments,
    getRoles,
    getEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole
};
