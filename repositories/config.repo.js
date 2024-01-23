const mysql = require("../db/mysql");
const UserListModel =  require('../models/UserList');
class ConfigRepo {
    getUserListRepo() {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT * FROM users';
                const data = await mysql.execute(query);
                const userList = data.map(item => new UserListModel(item));
                resolve(userList);
            } catch (error) {
                reject(error);
            }
        })
    }
}
module.exports = ConfigRepo;