const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { loggerMiddleware, requestMiddleware, errorHandlingMiddleware, responseMiddleware } = require('./middleware');
const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));
app.use(loggerMiddleware);

// app.use(requestMiddleware);
// app.use(responseMiddleware);
app.use('/', require('./routes/routes'));
app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
	console.log('-----------------------------------------------');
	console.log(`Server running on http://localhost:${PORT} 😎`);
})
// const { OCRService } = require('./services/ocr.service');
// async function test() {
// 	const file_path = 'uploads/files/sample.pdf';
// 	const ocrService = new OCRService();
// 	const data = await ocrService.convertTextFromPdf(file_path);
// 	console.log("Data => ", data.text);
// }
// test();