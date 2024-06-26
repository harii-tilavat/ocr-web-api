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
                const ocrService =
                    new OCRService();
                const id = uuidv4();
                const password = md5(data.password);
                const ref_code = ocrService.generateReferralCode();
                const userdata = { ...data, id, password, ref_code };

                const isRegister = await this.configRepo.userSignupRepo(userdata);
                if (isRegister) {
                    // const lookup = await this.configRepo.userLoginRepo(userdata.username, userdata.password);
                    const creditData = await ocrRepo.addCredits(id);
                    const otpSent = await this.addOtp(data.email, id);
                    if (creditData) {
                        if (userdata.user_ref_code) {
                            const data = await ocrRepo.checkReferal(userdata.user_ref_code);
                            if (data && data.length > 0) {
                                const user_ref_id = data[0].id;
                                await ocrRepo.updateCredit([id, user_ref_id], 10, 10);
                                await ocrRepo.addReferalRepo(id, user_ref_id);
                            }
                        }
                    } else {
                        throw new BaseException('Something went wrong!', 409);
                    }
                    if (otpSent) {
                        resolve(isRegister);
                    } else {
                        throw new BaseException('Enter valid email!', 409);
                    }
                } else {
                    throw new BaseException('already username or email exists try different one!', 409);
                }
            } catch (error) {
                if (error && error.code == 'ER_DUP_ENTRY') {
                    reject(new BaseException('already username or email exists try different one!', 409));
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
    updateType(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const { type, user_id, is_verified } = data;
                if (!(type && user_id)) {
                    throw new BaseException('Please provide required fields!');
                }
                const lookup = await this.configRepo.updateTypeRepo(user_id, type, is_verified);
                if (lookup) {
                    resolve(lookup);
                } else {
                    throw new BaseException('User not exists!', 404);
                }
            } catch (error) {
                reject(error);
            }
        })
        // updateUser() {
    }
    changePassword(userdata) {
        return new Promise(async (resolve, reject) => {
            try {
                const { password, newPassword, user_id, email } = userdata;
                if (!(password && newPassword && user_id)) {
                    throw new BaseException('Provide all required fields');
                }
                const ocrService = new OCRService();
                const lookup = await this.configRepo.validPasswordRepo(user_id, md5(password));
                if (lookup && lookup.length > 0) {
                    const data = await this.configRepo.changePasswordRepo(user_id, md5(newPassword));
                    const emailConfig = {
                        subject: 'Password changed!',
                        htmlContent: `
                        <p>Your password has been succesfully changed! at ${new Date()} <p>
                        <h4>Thank you from OCR team.<h4>
                        `
                    }
                    const emailSent = await ocrService.sendEmail(email, emailConfig);
                    if (emailSent) {
                        console.log("Change password email send");
                    }
                    resolve(data);
                } else {
                    throw new BaseException('Invalid Password! Try again', 401);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    addOtp(email, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const minute = 10;
                const ocrService = new OCRService();
                const otp = ocrService.generateOtp();
                const expirationTime = new Date(Date.now() + (minute * 60 * 1000));
                const users = {
                    otp: otp,
                    email: email
                }
                const isOtpSent = await ocrService.sendOtp(users, otp);
                if (isOtpSent) {
                    const lookup = await this.configRepo.addOtpRepo(user_id, otp, email, expirationTime);
                    if (lookup) {
                        resolve(lookup);
                    }
                } else {
                    throw new BaseException('Otp sending error!');
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    verifyOTPRepo(otp) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!otp) {
                    throw new BaseException('Enter a valid OTP!');
                }
                const ocrService = new OCRService();
                const lookup = await this.configRepo.verifyOTPRepo(otp);
                if (lookup && lookup.length) {
                    const { user_id, email } = lookup[0];
                    const isVerified = await this.configRepo.verifyUser(user_id);
                    if (isVerified) {
                        await this.configRepo.removeOtp(user_id);
                        const emailConfig = {
                            subject: 'Registration successfully.',
                            htmlContent: `
                            <p> Your registration has been successfully! <p>
                            <h4>Thank you from OCR team! <h4>
                            `
                        }
                        await ocrService.sendEmail(email, emailConfig);
                        resolve(lookup[0]);
                    } else {
                        throw new BaseException('User not verified!');
                    }
                } else {
                    throw new BaseException('Invalid OTP!');
                }
            } catch (error) {
                reject(error);
            }
        })
    }
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
    getUserByEmail(email, domain) {
        return new Promise(async (resolve, reject) => {
            try {
                const lookup = await this.configRepo.getUserByEmailRepo(email);
                if (lookup && lookup.length) {
                    // const userList = lookup.map(item => new UserListModel(item));
                    const token = await this.jwtTokenEncoded({email});
                    const resetLink = `https://${domain}/reset-password?token=${token}`;
                    const ocrService = new OCRService();
                    const emailConfig = {
                        subject: 'Reset password',
                        htmlContent: `
                        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2>Password Reset</h2>
                        <p>Hello,</p>
                        <p>You have requested to reset your password. Please click the button below to reset your password.</p>
                        <p style="text-align: center;">
                          <a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Reset Password</a>
                        </p>
                        <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
                        <p>Thank you!</p>
                      </div>
                        `
                    }
                    const sentEmail = ocrService.sendEmail(email, emailConfig);
                    if (sentEmail) {
                        resolve(resetLink);
                    } else {
                        throw new BaseException();
                    }
                } else {
                    throw new BaseException('Email is not registered with us!', 404);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    verifyJWTToken(token){
        return new Promise((resolve,reject)=>{
            try {
                const jwtSecret = fs.readFileSync(path.resolve('./jwtRSA256.key'), { encoding: 'utf-8' });
                jwt.verify(token, jwtSecret, (err, decoded) => {
                    if (err) {
                       reject(err);
                    }
                    console.log(decoded);
                    resolve(decoded);
                });

            } catch (error) {
                reject(error);
            }
        })
    }
    resetPassoword(userInfo) {
        return new Promise(async (resolve, reject) => {
            try {
                const { token, newPassword } = userInfo;
                const ocrService = new OCRService();
                const verifiedToken = await this.verifyJWTToken(token);
        
                resolve(verifiedToken);
            } catch (error) {
                reject(error);
            }
        })
    }
}
module.exports = ConfigBiz;