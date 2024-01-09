const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const mysql = require('mysql2');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { products_route, users_route } = require('./routes');

app.use("/api/products", products_route);
app.use("/api/users", users_route);

app.get('/', (req, res) => {
	res.send("Hi, I am Harit Tilavat!");
})

const db = 

app.listen(PORT, () => {
	console.log('-------------------------------------------');
	console.log('Server running or http://localhost:8000 😎');
	console.log('-------------------------------------------');
})
