const { v4 } = require("uuid");
const mysql = require("../db/mysql");
class EmployeeRepo {
    getEmployeeListRepo() {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT * FROM employees';
                const data = await mysql.execute(query, []);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    getEmployeeRepo(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT * FROM employees WHERE empId = ?';
                const data = await mysql.execute(query, [id]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    setEmployeeRepo(employee) {
        return new Promise(async (resolve, reject) => {
            try {
                // Generate unique employee id 
                const empId = v4();
                const { empName, empLocation, empPosition, empSalary } = employee;
                const query = 'INSERT INTO employees (empId, empName, empLocation, empPosition, empSalary) values (?, ?, ?, ?, ?)';
                const data = await mysql.execute(query, [empId, empName, empLocation, empPosition, empSalary]);
                resolve(data);
                debugger;
            } catch (error) {
                reject(error);
            }
        })
    }
    updateEmployeeRepo(id, employee) {
        return new Promise(async (resolve, reject) => {
            try {
                const { empName, empLocation, empPosition, empSalary } = employee;
                const query = 'UPDATE employees SET empName = ?, empLocation = ?, empPosition = ?, empSalary = ? WHERE empId = ?';
                const data = await mysql.execute(query, [empName, empLocation, empPosition, empSalary, id]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    deleteEmployeeRepo(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'DELETE FROM employees WHERE empId = ? ';
                const data = await mysql.execute(query, [id]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
}
module.exports = EmployeeRepo;