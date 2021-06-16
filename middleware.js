const { burritoValidateSchema } = require('./validationSchemas');
const ExpressError = require('./utilities/ExpressError');
const Burrito = require('./models/burrito');

module.exports.validateBurrito = (req, res, next) => {
    const { error } = burritoValidateSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    };
}