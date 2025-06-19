const Joi = require('joi');

module.exports = (schema) => async (req, res, next) => {
    try {
        
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path[0],
                message: detail.message.replace(/['"]/g, '')
            }));
            return res.status(400).json({ errors });
        }


        req.body = value;
        next();
    } catch (err) {
        next(err);
    }
};