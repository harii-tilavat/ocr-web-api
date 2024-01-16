const BaseException = require('../exceptions/base.exception');
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
    getEmployee(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.EmloyeeRepo.getEmployeeRepo(id);
                // resolve(lookup)
                if (!lookup) {
                    resolve(lookup);
                } else {
                    throw new BaseException('Testing message', 400);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    addEmployee() {
        return new Promise(async (resolve, reject) => {
            try {
                // Call the repo
            } catch (error) {
                
            }
        })
    }
}
module.exports = EmployeeBiz;