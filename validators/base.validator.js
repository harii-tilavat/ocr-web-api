const { SchemaException } = require("../exceptions");

class BaseValidator {
    prepareValidationErrorObj(validatorResult) {
        try {
            if (!validatorResult.valid) {
                throw new SchemaException(validatorResult.errors);
            }
        } catch (error) {
            throw error;
        }
    }
}
module.exports = BaseValidator;