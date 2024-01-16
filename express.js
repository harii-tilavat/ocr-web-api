const express = require('express');
const cors = require('cors');
const { ErrorHandlingMiddleware, LoggerMiddleware } = require('./middleware');
const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const routes = require('./routes/routes');
app.use(LoggerMiddleware);
// app.use(ErrorHandlingMiddleware);
app.use('/', routes);

app.listen(PORT, () => {
	console.log('-----------------------------------------------');
	console.log(`Server running on http://localhost:${PORT} 😎`);
})
