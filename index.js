const inquirer = require('inquirer');
const db = require('./db');

async function startApp() {
    try {
        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        });

        switch (action) {
            case 'View all departments':
                await db.getDepartments();
                break;
            case 'View all roles':
                await db.getRoles();
                break;
            case 'View all employees':
                await db.getEmployees();
                break;
            case 'Add a department':
                await db.addDepartment();
                break;
            case 'Add a role':
                await db.addRole();
                break;
            case 'Add an employee':
                await db.addEmployee();
                break;
            case 'Update an employee role':
                await db.updateEmployeeRole();
                break;
            case 'Exit':
                console.log('Goodbye!');
                process.exit();
                break;
        }
        startApp();
    } catch (error) {
        console.error(error);
        startApp();
    }
}

startApp();


