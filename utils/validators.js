const Joi = require("joi");

module.exports = class {
    static validate(payload, schema) {
        try {
            return Joi.attempt(payload, schema, {
                abortEarly: false,
                convert: true,
                stripUnknown: true
            });
        } catch(errors) {
            return Promise.reject(this.modifyErrors(errors));
        }
    }
    
    static modifyErrors(errors) {
        if (!errors.details) return { message: errors.message };
        
        return errors.details.reduce((acc, error) => {
            const key = error.path.join('.');
            acc[key] = error.message;
            return acc;
        }, {});
    }
}