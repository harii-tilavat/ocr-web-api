const { BaseException, AuthException } = require("../exceptions");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require("path");

module.exports = async (req, res, next) => {
    try {
        if (req.originalUrl.includes('/login') || req.originalUrl.includes('/register')) {
            next();
        }
        if (!req.headers.authorization) {
            // throw new AuthException();
            next();
        }
        const token = req.headers.authorization;
        const jwtSecret = fs.readFileSync(path.resolve('./jwtRSA256.key'), { encoding: 'utf-8' });
        // jwt.verify(token, jwtSecret,(err,decoded)=>{
        //     console.log("ERROR => ",err);
        //     console.log("decoded => ",decoded);
        // });

    } catch (error) {
        next(error);
    }

}