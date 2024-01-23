const BaseException = require("./base.exception");

class MissingParamException extends BaseException {
    constructor(param) {
        super(`Bad request! Missing param ${param}`, 404);
    }
}
module.exports = MissingParamException;