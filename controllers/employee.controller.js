const EmployeeBiz = require("../biz/employee.biz")

class EmployeeController {
    register(app) {
        app.route('/employees')
            .get(async (req, res, next) => {
                try {
                    const employeeBiz = new EmployeeBiz();
                    const data = await employeeBiz.getEmployeeList();
                    res.json({ data, message: 'Employee list' });
                } catch (error) {
                    next(error);
                }
            })
            .post(async (req, res, next) => {
                try {
                    console.log("Body ==>> ", req.body);
                    const employeeBiz = new EmployeeBiz();
                    const data = await employeeBiz.setEmployee(req.body);
                    res.json({ data, message: 'Inserted successfully' });
                } catch (error) {
                    next(error);
                }
            })

        app.route('/employees/:id')
            .get(async (req, res, next) => {
                try {
                    const { id } = req.params;
                    const employeeBiz = new EmployeeBiz();
                    const data = await employeeBiz.getEmployee(id);
                    res.json({ data, message: 'Employee detail' });
                    // employeeBiz.getEmployeeById()
                } catch (error) {
                    next(error);
                }
            })
            .put(async (req, res, next) => {
                try {
                    const { id } = req.params;
                    const employeeBiz = new EmployeeBiz();
                    const data = await employeeBiz.updateEmployee(id, req.body);
                    res.json({ data, message: 'Employee updated!' });
                } catch (error) {
                    next(error);
                }
            })
            .delete(async (req, res, next) => {
                try {
                    const { id } = req.params;
                    const employeeBiz = new EmployeeBiz();
                    const data = await employeeBiz.deleteEmployee(id);
                    res.json({ data, message: 'Deleted successfully! ' });
                } catch (error) {
                    next(error);
                }
            })
    }
}
module.exports = EmployeeController;