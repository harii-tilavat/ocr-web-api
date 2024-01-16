const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const router = require('ro')
const { logger, authorized } = require('./handlers');
const { productsArray } = require('./myObject');

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use([authorized, logger]);
const users = require('./db/users');
// app.use(express.static(path.resolve(__dirname, 'public')));

// app.get('/', (req, res) => {
//     res.sendFile(path.resolve(__dirname, './public/index.html'));
// })


// app.get('/api/products/:id', (req, res) => {
//     const { id } = req.params;
//     console.log(productsArray)
//     const user = productsArray.find(i => i.id === +id);
//     console.log("product ==>>> ", user);
//     if (!user) {
//         res.send({ data: user, msg: `Data not found with ${id} id!` });
//         return;
//     }
//     res.send(user);
// })

// app.post('/login', (req, res) => {
// 	const { name, password } = req.body;
// 	if (name !== '' && password !=='') {
// 		const user = users.find(i => i.name === name && i.password === password);
// 		if (user) {
// 			res.send({ success: true, user: user.name });
// 		} else {
// 			res.send({ success: false, msg: 'Invalid user' });
// 		}
// 	} else {
// 		res.send({ success: false, msg: 'Provide value please!' });
// 	}
// 	// res.send(req.body);
// })

// app.get('/', (req, res) => {
// 	res.send({ success: true, data: req.user });
// })

// app.get('/api/users', (req, res) => {
// 	res.json({ success: true, users: users });
// })


// app.get('/api/products/query', (req, res) => {
// 	if (req.query && req.query.limit) {
// 		const slicedArray = productsArray.slice(0, +req.query.limit);
// 		res.json(slicedArray);
// 		return;
// 	}
// 	res.json(productsArray);
// })

app.listen(8000, () => {
	console.log('Server running or http://localhost:8000');
})
