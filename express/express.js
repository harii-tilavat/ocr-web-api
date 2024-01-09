const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const upload = require('./services/multerService');
const routes = require('./routes/routes');

app.use('/', routes);
// app.get('/home', (req, res) => {
// 	res.json({ msg: 'testing' });
// })
app.post('/uploads', upload.single("file"), (req, res) => {
	console.log("Post request!");
	res.json({ success: true, msg: 'testing successfull' });
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
})