const express = require('express');
const router = express.Router();

const EmployeeController = require('../controllers/employee.controller');

const employeeController = new EmployeeController();
employeeController.register(router);


module.exports = router;


