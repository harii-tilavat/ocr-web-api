const express = require('express');
const router = express.Router();

const EmployeeController = require('../controllers/employee.controller');
const OCRController = require('../controllers/ocr.controller');

const employeeController = new EmployeeController();
employeeController.register(router);

const ocrController = new OCRController();
ocrController.register(router);

module.exports = router;


