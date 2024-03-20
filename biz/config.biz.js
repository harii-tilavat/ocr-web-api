const { v4: uuidv4 } = require("uuid");
const ConfigRepo = require("../repositories/config.repo");
const BaseException = require("../exceptions/base.exception");;
const md5 = require("md5");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require("path");
const { OCRService } = require("../services/ocr.service");
const OCRRepo = require("../repositories/ocr.repository");
const OCRBiz = require("./ocr.biz");

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
                if (!(data.name && data.username && data.email && data.password)) {
                    throw new BaseException('Provide all required fields please! ', 404);
                }
                const ocrRepo = new OCRRepo();
                const ocrService = new OCRService();
                const id = uuidv4();
                const password = md5(data.password);
                const ref_code = ocrService.generateReferralCode();
                const userdata = { ...data, id, password, ref_code };

                const isRegister = await this.configRepo.userSignupRepo(userdata);
                if (isRegister) {
                    const lookup = await this.configRepo.userLoginRepo(userdata.username, userdata.password);
                    const creditData = await ocrRepo.addCredits(id);

                    if (creditData) {
                        if (userdata.user_ref_code) {
                            const data = await ocrRepo.checkReferal(userdata.user_ref_code);
                            if (data && data.length > 0) {
                                const user_ref_id = data[0].id;
                                await ocrRepo.updateCredit([id, user_ref_id], 10, 10);
                                await ocrRepo.addReferalRepo(id, user_ref_id);
                            }
                        }
                        resolve(lookup[0]);
                    } else {
                        throw new BaseException('Something went wrong!', 409);
                    }
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
    updateUser(user_id, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const userdata = { ...data };
                const lookup = await this.configRepo.updateUserRepo(user_id, userdata);
                if (lookup) {
                    resolve(lookup);
                }
            } catch (error) {
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
    // updateUser() {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const lookup = await this.configRepo.userLoginRepo(uName, md5(pwd));
    //             if (lookup && lookup.length > 0) {
    //                 resolve(lookup[0]);
    //             } else {
    //                 throw new BaseException('Invalid user!', 401);
    //             }
    //         } catch (error) {
    //             reject(error);
    //         }
    //     })
    // }
    jwtTokenEncoded(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const expiresHour = 240;
                const jwtSecretKey = fs.readFileSync(path.resolve('./jwtRSA256.key'), { encoding: 'utf8' });
                const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (expiresHour * 60 * 60), ...data }, jwtSecretKey);
                resolve(token);
            } catch (error) {
                reject(error);
            }
        })
    }
}
module.exports = ConfigBiz;