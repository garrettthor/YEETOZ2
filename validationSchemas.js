const Joi = require('joi');

module.exports.burritoValidateSchema = Joi.object({
    burrito: Joi.object({
        title: Joi.string().required(),
        // picture: Joi.string().required(),
        restaurant: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().positive().precision(2),
        description: Joi.string().required(),
    }).required()
});