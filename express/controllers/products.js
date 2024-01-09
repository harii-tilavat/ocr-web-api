const { products } = require('../db/data');
const getAllProduct = async (req, res) => {
    res.status(200).send({ sucess: true, msg: 'Products data!', data: products });
}
module.exports = { getAllProduct };