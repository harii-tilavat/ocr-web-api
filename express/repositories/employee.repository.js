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
}
module.exports = EmployeeRepo;