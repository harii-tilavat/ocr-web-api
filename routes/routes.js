const express = require('express');
const router = express.Router();

const EmployeeController = require('../controllers/employee.controller');
const OCRController = require('../controllers/ocr.controller');
const ConfigController = require('../controllers/config.controller');

const employeeController = new EmployeeController();
employeeController.register(router);

const ocrController = new OCRController();
ocrController.register(router);

const confgiController = new ConfigController();
confgiController.register(router);

module.exports = router;


