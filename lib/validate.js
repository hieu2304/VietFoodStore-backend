const Joi = require('joi');

module.exports.checkAuth = (data)=> {
    const schema = Joi.object().keys({ 
        email:Joi.string().required(),
        passWord: Joi.string().required(), 
    }); 
    const result = schema.validate(data);
    return result;
}
