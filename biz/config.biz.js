const ConfigRepo = require("../repositories/config.repo");

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
}
module.exports = ConfigBiz;