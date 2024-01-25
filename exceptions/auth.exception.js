const BaseException = require("./base.exception");


class AuthException extends BaseException {
    constructor() {
        super('Authorization token missing!!', 403);
    }
}
module.exports = AuthException;