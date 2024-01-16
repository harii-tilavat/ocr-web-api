const express = require('express');
const cors = require('cors');
const loggerMiddlewar = require('./middleware/LoggerMiddleware');
const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const routes = require('./routes/routes');
app.use(loggerMiddlewar);
app.use('/', routes);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
})
