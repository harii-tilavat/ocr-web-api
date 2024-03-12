const json2xls = require('json2xls');
const fs = require('fs');
class OCRService {
    generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
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