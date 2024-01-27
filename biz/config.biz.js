const { v4: uuidv4 } = require("uuid");
const ConfigRepo = require("../repositories/config.repo");
const BaseException = require("../exceptions/base.exception");;
const md5 = require("md5");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require("path");

class ConfigBiz {
    constructor() {
        this.configRepo = new ConfigRepo();
    }
    loginUser(uName, pwd) {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.configRepo.userLoginRepo(uName, md5(pwd));
                if (lookup && lookup.length > 0) {
                    resolve(lookup[0]);
                } else {
                    throw new BaseException('Invalid user!', 401);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    registerUser(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!(data.name && data.lastname && data.username && data.password)) {
                    throw new BaseException('Provide all fields please! ', 404);
                }
                const id = uuidv4();
                const password = md5(data.password);
                const userdata = { ...data, id, password };
                const isRegister = await this.configRepo.userSignupRepo(userdata);
                if (isRegister) {
                    const lookup = await this.configRepo.userLoginRepo(userdata.username, userdata.password);
                    resolve(lookup[0]);
                } else {
                    throw new BaseException('already username exists try different one!', 409);
                }
            } catch (error) {
                if (error && error.code == 'ER_DUP_ENTRY') {
                    reject(new BaseException('already username exists try different one!', 409));
                }
                reject(error);
            }
        })
    }
    getUserList() {
        return new Promise(async (resolve, reject) => {
            try {
                const userList = await this.configRepo.getUserListRepo();
                resolve(userList);
            } catch (error) {
                reject(error);
            }
        })
    }
    jwtTokenEncoded(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const expiresHour = 1;
                const jwtSecretKey = fs.readFileSync(path.resolve('./jwtRSA256.key'), { encoding: 'utf8' });
                const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (expiresHour * 60 * 60), ...data }, jwtSecretKey);
                resolve({ token });
            } catch (error) {
                reject(error);
            }
        })
    }
}
module.exports = ConfigBiz;