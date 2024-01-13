const EmployeeRepo = require("../repositories/employee.repository");


class EmployeeController {
    register(app) {
        app.route('/emp')
            .get(async (req, res, next) => {
                try {
                    const employeeRepo = new EmployeeRepo();
                    const employees = await employeeRepo.getEmployeesRepo();
                    res.send({ success: true, message: 'Data fetched', data: employees });
                } catch (error) {
                    next(error);
                }
            })
            .post(async (req, res, next) => {
                try {

                } catch (error) {

                }
            })
    }
}
module.exports = EmployeeController;