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
                    const employeeBiz = new EmployeeBiz();
                    const data = await employeeBiz.setEmployee(req.body);
                    res.json({ data, message: 'Inserted successfully' });
                } catch (error) {
                    res.status(400).json({ error, message: 'Insertion error!' });
                }
            })

        app.route('/employees/:id')
            .get(async (req, res) => {
                try {
                    const { id } = req.params;
                    const employeeBiz = new EmployeeBiz();
                    const data = await employeeBiz.getEmployee(id);
                    res.json({ data, message: 'Employee detail' });
                    // employeeBiz.getEmployeeById()
                } catch (error) {
                    res.status(400).json({ error: error, message: 'Employee not found' });
                }
            })
            .put(async (req, res) => {
                try {
                    const { id } = req.params;
                    const employeeBiz = new EmployeeBiz();
                    const data = await employeeBiz.updateEmployee(id, req.body);
                    res.json({ data, message: 'Employee updated!' });
                } catch (error) {
                    res.status(400).json({ error, message: 'Employee error' });
                }
            })
            .delete(async (req, res) => {
                try {
                    const { id } = req.params;
                    const employeeBiz = new EmployeeBiz();
                    const data = await employeeBiz.deleteEmployee(id);
                    res.json({ data, message: 'Deleted successfully! ' });
                    // employeeBiz.EmloyeeRepo
                    // Cal bizz
                } catch (error) {
                    res.status(400).json({ error, message: 'Deleting error! ' });
                }
            })
    }
}
module.exports = EmployeeController;