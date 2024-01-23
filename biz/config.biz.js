const { v4: uuidv4 } = require("uuid");
const ConfigRepo = require("../repositories/config.repo");
const BaseException = require("../exceptions/base.exception");;
const md5 = require("md5");

class ConfigBiz {
    constructor() {
        this.configRepo = new ConfigRepo();
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
    registerUser(data) {
        return new Promise(async (resolve, reject) => {
            try {
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
}
module.exports = ConfigBiz;