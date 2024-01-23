const fs = require("fs");
const path = require('path');

const loggerMiddlewar = (req, res, next) => {
    const data = `[${new Date().toLocaleString()}] ${req.method} ${req.url} \n`;
    try {
        const result = fs.appendFileSync(path.resolve(__dirname, '../api-log.txt'), data);
    } catch (error) {
        console.log("ERROR =>", error);
    }
    next();
}
module.exports = loggerMiddlewar;