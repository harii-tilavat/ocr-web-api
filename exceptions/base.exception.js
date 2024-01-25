class BaseException extends Error {
    constructor(message, status = 500) {
        if (!message) {
            message = 'Oops!!! Something went wrong';
        }
        super(message);
        this.status = status;
    }
}
module.exports = BaseException;