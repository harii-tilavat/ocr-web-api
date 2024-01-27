const { BaseException, AuthException } = require("../exceptions");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require("path");

module.exports = async (req, res, next) => {
    try {
        if (req.originalUrl.includes('/login') || req.originalUrl.includes('/register')) {
            return next();
        }
        if (!req.headers.authorization) {
            throw new AuthException();
        }
        const token = req.headers.authorization;
        const jwtSecret = fs.readFileSync(path.resolve('./jwtRSA256.key'), { encoding: 'utf-8' });
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                return next(err);
            }
            next();
        });

    } catch (error) {
        next(error);
    }

}