const json2xls = require('json2xls');
const fs = require('fs');
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
    generateTextFile = (fileUrl, data) => {
        fs.writeFileSync(fileUrl, data);
    }
}

module.exports = { OCRService };