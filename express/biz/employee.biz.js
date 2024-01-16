const EmloyeeRepo = require('../repositories/employee.repository');
class EmployeeBiz {
    constructor() {
        this.EmloyeeRepo = new EmloyeeRepo();
    }
    getEmployeeList() {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.EmloyeeRepo.getEmployeeListRepo();
                if (lookup) {
                    resolve(lookup);
                } else {
                    throw new Error('Data not found!');
                }
            } catch (error) {
                reject(error);
            }
        })
    }
}
module.exports = EmployeeBiz;