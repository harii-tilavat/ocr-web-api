const SchemaValidator = require('jsonschema').Validator;
const { BaseValidator } = require('.');
const { userRegisterModel, userRequestModel } = require('../schema/config.schema');

class SchemaJsonValidator extends BaseValidator {
    createUser(data) {
        try {
            const schemaValidator = new SchemaValidator();
            const validatorResult = schemaValidator.validate(data, userRegisterModel)
            super.prepareValidationErrorObj(validatorResult);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = SchemaJsonValidator;