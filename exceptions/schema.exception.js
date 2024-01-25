const { BaseException } = require(".");

class SchemaException extends BaseException {
    constructor(errors) {
        super('Bad schema', 400);
        this.fields = errors.map(error => ({
            description: error.stack
        }))
    }
}
module.exports = SchemaException;