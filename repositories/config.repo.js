const mysql = require("../db/mysql");
const UserListModel = require('../models/UserList');
class ConfigRepo {
    userLoginRepo(username, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT * FROM users WHERE username = ? AND password = ? AND is_verified = 1';
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
    updateUserRepo(user_id, data) {
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
                const query = 'SELECT * FROM users ORDER BY TYPE, created_at DESC';
                const data = await mysql.execute(query);
                const userList = data.map(item => new UserListModel(item));
                resolve(userList);
            } catch (error) {
                reject(error);
            }
        })
    }
    getUserByIdRepo(user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT * FROM users WHERE id = ?';
                const data = await mysql.execute(query, [user_id]);
                const userList = data.map(item => new UserListModel(item));
                resolve(userList);
            } catch (error) {
                reject(error);
            }
        })
    }
    updateTypeRepo(user_id, type, is_verified) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `UPDATE users SET TYPE = ?,is_verified = ? WHERE id = ?`;
                const lookup = await mysql.execute(query, [type, is_verified, user_id]);
                resolve(lookup);
            } catch (error) {
                reject(error);
            }
        })
    }
    getUserByEmailRepo(email) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT * FROM users WHERE email = ?';
                const data = await mysql.execute(query, [email]);
                const userList = data.map(item => new UserListModel(item));
                resolve(userList);
            } catch (error) {
                reject(error);
            }
        })
    }
    validPasswordRepo(user_id, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT * FROM users WHERE id = ? AND password = ?';
                const data = await mysql.execute(query, [user_id, password]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    changePasswordRepo(user_id, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `UPDATE users SET password = ? WHERE id = ?`;
                const data = await mysql.execute(query, [password, user_id]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    addOtpRepo(user_id, otp,email, expirationTime) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'INSERT INTO otps (user_id, otp, email, expires_at) VALUES (?, ?, ?, ?)';
                debugger;
                await mysql.execute(query, [user_id, otp, email, expirationTime]);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        })
    }
    verifyOTPRepo(otp) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'SELECT user_id, email FROM otps WHERE otp = ? AND expires_at > NOW()'; //AND expires_at > NOW()
                const data = await mysql.execute(query, [otp]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    verifyUser(user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'UPDATE users SET is_verified = 1 WHERE id = ?';
                const data = await mysql.execute(query, [user_id]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    removeOtp(user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'UPDATE otps SET otp = NULL, expires_at = NULL WHERE user_id = ?';
                const data = await mysql.execute(query, [user_id]);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }

}
module.exports = ConfigRepo;