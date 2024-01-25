const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { loggerMiddleware, requestMiddleware, errorHandlingMiddleware } = require('./middleware');
const PORT = process.env.PORT || 8000;
const app = express();
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const routes = require('./routes/routes');
app.use(loggerMiddleware);
app.use(requestMiddleware);
app.use('/', routes);
app.use(errorHandlingMiddleware);


app.listen(PORT, () => {
	console.log('-----------------------------------------------');
	console.log(`Server running on http://localhost:${PORT} 😎`);
})
