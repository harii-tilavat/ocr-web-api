const EmployeeBiz = require("../biz/employee.biz")

class HotelController {
    register(app) {
        app.route('/employees')
            .get(async (req, res) => {
                try {
                    const employeeBiz = new EmployeeBiz();
                    const data = employeeBiz.getEmployeeList();
                    res.json({ data, message: 'Employee list' });
                } catch (error) {
                    res.json({ error, message:'Something went wrong!'});;
                }
            })
    }
}