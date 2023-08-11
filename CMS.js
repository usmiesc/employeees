const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Password',
  database: 'employees_tracker',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
  start();
});

const start = () => {
  inquirer
    .prompt([
      {
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
          'Exit',
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          console.log('Goodbye!');
          break;
      }
    });
};

const viewAllDepartments = () => {
  connection.query('SELECT * FROM departments', (err, results) => {
    if (err) throw err;
    console.log('Departments:');
    results.forEach((department) => {
      console.log(`${department.id} | ${department.name}`);
    });
    start();
  });
};

const viewAllRoles = () => {
  connection.query(
    'SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles JOIN departments ON roles.department_id = departments.id',
    (err, results) => {
      if (err) throw err;
      console.log('Roles:');
      results.forEach((role) => {
        console.log(`${role.id} | ${role.title} | $${role.salary} | ${role.department}`);
      });
      start();
    }
  );
};

const viewAllEmployees = () => {
  connection.query(
    'SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, CONCAT(managers.first_name, " ", managers.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN employees AS managers ON employees.manager_id = managers.id',
    (err, results) => {
      if (err) throw err;
      console.log('Employees:');
      results.forEach((employee) => {
        console.log(`${employee.id} | ${employee.first_name} ${employee.last_name} | ${employee.title} | $${employee.salary} | Manager: ${employee.manager || 'None'}`);
      });
      start();
    }
  );
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:',
      },
    ])
    .then((answers) => {
      const department = { name: answers.name };
      connection.query('INSERT INTO departments SET ?', department, (err, result) => {
        if (err) throw err;
        console.log('Department added successfully!');
        start();
      });
    });
};

const addRole = () => {
  connection.query('SELECT * FROM departments', (err, departments) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the title of the role:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary for the role:',
        },
        {
          type: 'list',
          name: 'department_id',
          message: 'Select the department for the role:',
          choices: departments.map((department) => ({ name: department.name, value: department.id })),
        },
      ])
      .then((answers) => {
        const role = {
          title: answers.title,
          salary: answers.salary,
          department_id: answers.department_id,
        };
        connection.query('INSERT INTO roles SET ?', role, (err, result) => {
          if (err) throw err;
          console.log('Role added successfully!');
          start();
        });
      });
  });
};

const addEmployee = () => {
  connection.query('SELECT * FROM roles', (err, roles) => {
    if (err) throw err;
    connection.query('SELECT * FROM employees', (err, employees) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'first_name',
            message: "Enter the employee's first name:",
          },
          {
            type: 'input',
            name: 'last_name',
            message: "Enter the employee's last name:",
          },
          {
            type: 'list',
            name: 'role_id',
            message: "Select the employee's role:",
            choices: roles.map((role) => ({ name: role.title, value: role.id })),
          },
          {
            type: 'list',
            name: 'manager_id',
            message: "Select the employee's manager:",
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
        ])
        .then((answers) => {
          const employee = {
            first_name: answers.first_name,
            last_name: answers.last_name,
            role_id: answers.role_id,
            manager_id: answers.manager_id,
          };
          connection.query('INSERT INTO employees SET ?', employee, (err, result) => {
            if (err) throw err;
            console.log('Employee added successfully!');
            start();
          });
        });
    });
  });
};

const updateEmployeeRole = () => {
  connection.query('SELECT * FROM employees', (err, employees))}
