const json2xls = require('json2xls');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const pdf = require('pdf-parse');
const { BaseException } = require('../exceptions');
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
   sendEmail(user, res) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'ocrweb441@gmail.com',
                pass: 'rmmj ffqr naah trfx'
            }
        });
        let info = transporter.sendMail({
            from: "ocrweb441@gmail.com", // sender address
            to: user.email, // list of receivers
            subject: "Verify your otp ✔", // Subject line
            template: "email",
            otp: user.otp,
            html: `<p>Thank you for registeringPlease Verify Your OTP : </p><h1>${user.otp} </h1>`
    
        }, function (err) {
            if (err) {
                return res.send(
                    {
                        message: "email is not sent",
    
                    })
            } else {
                return res.send(
                    {
                        message: "email sent succesfully !",
    
                    })
            }
        });
    }
}

module.exports = { OCRService };