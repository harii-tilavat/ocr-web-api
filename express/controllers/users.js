const {users} = require('../db/data');
const getAllUsers = async (req, res) => {
    res.status(200).send({ sucess: true, msg: 'Data successfully fetched!', data: users });
}
module.exports = getAllUsers;