const express = require('express');
const mysql = require('../db/mysql');
const router = express.Router();
const upload = require('../services/multerService');
const OCRController = require('../controllers/ocr.controller');
const { v4 } = require('uuid');
const EmployeeController = require('../controllers/employee.controller');
const EmployeeRepo = require('../repositories/employee.repository');
const EmployeeBiz = require('../biz/employee.biz');

router.route('/users')
    .get((req, res) => {
        const query = 'SELECT * FROM users';
        const salary = req.query['salary'];
        db.query(query, [salary], (err, result) => {
            if (!err) {
                res.json({ success: true, data: result });

            } else {
                res.json({ success: false, msg: err.message });
            }
        });
    })
    .post((req, res) => {
        const { email, username, password } = req.body;
        const userId = v4();
        const query = 'INSERT INTO users (userId, email, username, password) values (?, ?, ?, ?)';
        // const { emp_id, emp_name, salary, dept_id, manager_id } = req.body;
        if (!email || !username || !password) {
            res.json({ success: false, msg: 'Provide all values please!' });
        } else {
            db.query(query, [userId, email, username, password], (err, result) => {
                if (!err) {
                    res.json({ success: true, msg: result })
                } else {
                    res.json({ success: false, msg: err.message });
                }
            })
        }
    })


router.route('/users/:id')
    .get((req, res) => {
        const query = 'SELECT * FROM users WHERE userId = ?';
        const { id } = req.params;

        db.query(query, [id], (err, result) => {
            if (!err) {
                res.json({ success: true, data: result });
            } else {
                res.status(400).json({ success: false, msg: err })
            }
        })
    })
    .delete((req, res) => {
        const query = 'DELETE FROM users WHERE userId = ?';
        const { id } = req.params;
        db.query(query, [id], (err, result) => {
            if (!err) {
                if (result.affectedRows > 0) {
                    res.json({ success: true, msg: 'Deleted successfully', result: result });
                } else {
                    res.status(404).json({ success: false, msg: 'User with the specified ID not found' });
                }
            } else {
                res.status(404).json({ success: false, error: err })
            }
        })
    })

// router.route('/data')
//     .get(OCRController.getData);
// ------------------------------- Employee ----------------------------

router.route('/employees')
    .get(async (req, res) => {
        try {
            const employeeBiz = new EmployeeBiz();
            const data = await employeeBiz.getEmployeeList();
            res.send({ data, message: 'Employee list' });
        } catch (error) {
            res.status(400).json({ error: error });
        }
    })
// .post((req, res) => {
//     const { empName, empLocation, empPosition, empSalary } = req.body;
//     const query = 'INSERT INTO employees (empId,empName,empLocation,empPosition,empSalary) VALUES (?, ?, ?, ?, ?)';
//     const empId = v4();
//     db.query(query, [empId, empName, empLocation, empPosition, empSalary], (err, result) => {
//         if (!err) {
//             res.json({ success: true, message: 'Employee added successfully!' });
//         } else {
//             res.status(400).json({ success: false, error: err, message: err.message });
//         }
//     })
// })

// router.route('/employees/:id')
//     .delete((req, res) => {
//         const { id } = req.params;
//         const query = 'DELETE FROM employees WHERE empId = ? ';
//         db.query(query, [id], (err, result) => {
//             if (!err) {
//                 if (result.affectedRows > 0) {
//                     res.json({ success: true, message: 'Employee deleted successfully!' });
//                 } else {
//                     res.status(404).json({ success: false, message: 'ID is not available!' });
//                 }
//             } else {
//                 res.status(404).json({ success: false, message: err.message });
//             }
//         })
//     })
//     .put((req, res) => {
//         const { id } = req.params;
//         const { empName, empLocation, empPosition, empSalary } = req.body;
//         const query = 'UPDATE employees SET empName = ?, empLocation = ?, empPosition = ?, empSalary = ? WHERE empId = ? ';
//         db.query(query, [empName, empLocation, empPosition, empSalary, id], (err, result) => {
//             if (!err) {
//                 res.json({ success: true, message: 'Employee updated successfully' });
//             } else {
//                 res.status(404).json({ success: true, error: err });
//             }
//         });

//     })



router.route('/uploads')
    .post(upload.single("file"), (req, res) => {
        console.log("Post request!");
        res.json({ success: true, msg: 'testing successfull' });
    })

// const employeeController = new EmployeeController();
// employeeController.register(router);

module.exports = router;


