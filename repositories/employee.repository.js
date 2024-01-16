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
    setEmployeeRepo() {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'INSERT INTO employees () VALUES ()';
            } catch (error) {
                
            }
        })
    }
}
module.exports = EmployeeRepo;