const mysql = require("../db/mysql");
const UserListModel = require('../models/UserList');
class ConfigRepo {
    userLoginRepo(username, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
                const userObj = await mysql.execute(query, [username, password]);
                const data = userObj.map(item => new UserListModel(item));
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    userSignupRepo(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const { id, name, email, lastname, username, password, ref_code } = data;
                const query = 'INSERT INTO users (id, name, email, lastname, username, password, ref_code) VALUES (?, ?, ?, ?, ?, ?, ?)';
                await mysql.execute(query, [id, name, email, lastname, username, password, ref_code]);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        })
    }
    updateUserRepo(user_id,data) {
        return new Promise(async (resolve, reject) => {
            try {
                const { name, lastname, number, country } = data;
                const query = 'UPDATE users SET name = ?, lastname = ?, number = ?, country = ? WHERE id = ?';
                const lookup = await mysql.execute(query, [name, lastname, number, country, user_id]);
                resolve(lookup);
            } catch (error) {
                reject(error);
            }
        })
    }
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