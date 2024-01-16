class BaseException extends Error {
    constructor(msg, status = 500) {
        if (!msg) {
            msg = 'Oops!!! Something went wrong';
        }
        super(msg);
        this.status = status;
        this.message = msg;
    }
}
module.exports = BaseException;