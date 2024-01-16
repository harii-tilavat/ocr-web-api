const EmployeeBiz = require("../biz/employee.biz")

class EmployeeController {
    register(app) {
        app.route('/employees')
            .get(async (req, res) => {
                try {
                    const employeeBiz = new EmployeeBiz();
                    const data = await employeeBiz.getEmployeeList();
                    res.json({ data, message: 'Employee list' });
                } catch (error) {
                    res.status(400).json({ error, message: 'Something went wrong!' });
                }
            })
            .post(async (req, res) => {
                try {
                    console.log("Body ==>> ", req.body);
                } catch (error) {
                    
                }
            })
        app.route('/employees/:id')
            .get(async (req, res) => {
                try {
                    const { id } = req.params;
                    const employeeBiz = new EmployeeBiz();
                    const data = await employeeBiz.getEmployee(id);
                    console.log("Data ", data);
                    res.json({ data, message: 'Employee detail' });
                    // employeeBiz.getEmployeeById()
                } catch (error) {
                    res.status(400).json({ error: error, message: 'Employee not found' });
                }
            })
    }
}
module.exports = EmployeeController;