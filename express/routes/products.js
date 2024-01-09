const express = require('express');
const router = express.Router();
const { getAllProduct } = require('../controllers/products');

router.route('/').get(getAllProduct);

module.exports = router;