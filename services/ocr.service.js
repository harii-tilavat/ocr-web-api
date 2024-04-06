const json2xls = require('json2xls');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const pdf = require('pdf-parse');
const { BaseException } = require('../exceptions');
const nodemailer = require('nodemailer');
class OCRService {
    generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    generateReferralCode = () => {
        let referralCode = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (let i = 0; i < 8; i++) {
            referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return referralCode;
    }
    convertJsonToExcel = (fileUrl, data) => {
        const xls = json2xls(data);
        fs.writeFileSync(fileUrl, xls, 'binary');
    }
    convertTextToWord = (fileUrl, data) => {
        fs.writeFileSync(fileUrl, data);
    }
    convertTextFromImage = async (fileUrl) => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await Tesseract.recognize(fileUrl, 'eng');
                if (data && data.data && data.data.text) {
                    resolve(data.data.text);
                } else {
                    throw new BaseException('Image file is not readable!');
                }
            } catch (error) {
                reject(error);
            }
        })

    }
    convertTextFromPdf = async (fileUrl) => {
        return new Promise(async (resolve, reject) => {
            try {
                const dataBuffer = fs.readFileSync(fileUrl);
                const data = await pdf(dataBuffer);
                if (data && data.text) {
                    resolve(data.text);
                } else {
                    throw new BaseException('PDF file is not readable!');
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    generateTextFile = (fileUrl, data) => {
        fs.writeFileSync(fileUrl, data);
    }
    sendEmail(email,emailConfig) {
        return new Promise(async (resolve, reject) => {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'ocrweb441@gmail.com',
                    pass: 'rmmj ffqr naah trfx'
                }
            });
            // const token = await configBiz.jwtTokenEncoded(email);

            const mailOptions = {
                from: 'ocrweb441@gmail.com',
                to: email,
                subject: emailConfig.subject,
                // text: `Click the following link to reset your password: http://localhost:4200/reset-password/${token}`,
                text: ``,
                html: emailConfig.htmlContent || '<p> Thank you.</p>'
            };
            let info = transporter.sendMail(mailOptions, function (err) {
                if (!err) {
                    // console.log("Email sent");
                    resolve(true);
                } else {
                    reject(err)
                    // throw new BaseException('Email sending error!');
                }
            });
        })
    }
    sendOtp(user, otp) {
        return new Promise(async (resolve, reject) => {
            try {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.GMAIL,
                        pass: process.env.GMAIL_PASSWORD
                    }
                });
                let info = transporter.sendMail({
                    from: "ocrweb441@gmail.com", // sender address
                    to: user.email, // list of receivers
                    subject: "Verify your otp ✔", // Subject line
                    template: "email",
                    otp: user.otp,
                    html: `
                        <p>Please Verify Your OTP : </p>
                        <p>Valid upto 10 minutes! </p>
                        <h1>${user.otp} </h1>
                        
                        `

                }, function (err) {
                    if (!err) {
                        // console.log("Email sent");
                        resolve(true);
                    } else {
                        reject(err)
                        // throw new BaseException('Email sending error!');
                    }
                });
            } catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = { OCRService };