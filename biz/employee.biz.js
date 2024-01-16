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
                if (lookup) {
                    resolve(lookup);
                } else {
                    throw new BaseException('Testing message', 400);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    setEmployee(employee) {
        return new Promise(async (resolve, reject) => {
            try {
                // ----------- Bussiness Logic ------
                // const { empName, empLocation, empPosition, empSalary } = employee;
                const lookup = await this.EmloyeeRepo.setEmployeeRepo(employee);
                if (lookup) {
                    resolve(lookup);
                } else {
                    throw new BaseException('Data not found!');
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    updateEmployee(id, employee) {
        return new Promise(async (resolve, reject) => {
            try {
                // Calling updateEmployeeRepo
                debugger;
                const lookup = await this.EmloyeeRepo.updateEmployeeRepo(id, employee);
                if (lookup) {
                    resolve(lookup);
                } else {
                    throw BaseException('Data not found!');
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    deleteEmployee(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.EmloyeeRepo.deleteEmployeeRepo(id);
                if (lookup && lookup.affectedRows) {
                    resolve(lookup);
                } else {
                    throw new BaseException('ID is invalid! ', 404);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
}
module.exports = EmployeeBiz;