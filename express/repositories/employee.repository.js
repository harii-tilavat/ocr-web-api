const mysql = require("../db/mysql");
class EmployeeRepo {
    getEmployeesRepo() {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT * FROM employees';
                mysql.query(query, [], (err, result) => {
                    resolve(result);
                });

            } catch (error) {
                reject(error);
            }
        })
    }
}
module.exports = EmployeeRepo;