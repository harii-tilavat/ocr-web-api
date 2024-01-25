const BaseException = require("../exceptions/base.exception");

module.exports = async (error, req, res, next) => {
    try {
        const errorObj = {
            message: error.message ? error.message : 'Something went wrong!',
            code: 'ERROR',
            // stack: error && error.stack ? error.stack : ''
        };
        let status = 500;
        if (error instanceof BaseException) {
            status = error.status;
            errorObj.message = error.message;
            errorObj.fields = error.fields ? error.fields : []
        }
        return res.status(status).json(errorObj);
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            code: 'ERROR'
        })
    }
};
