const Joi = require('joi');

module.exports.checkAuth = (data)=> {
    const schema = Joi.object().keys({ 
        email:Joi.string().required(),
        passWord: Joi.string().required(), 
    }); 
    const result = schema.validate(data);
    return result;
}

module.exports.checkRegister = (data)=> {
    const schema = Joi.object().keys({ 
        email:Joi.string().required(),
        passWord: Joi.string().required(), 
        fullName: Joi.string().required(), 
        phoneNumber:Joi.number(),
    }); 
    const result = schema.validate(data);
    return result;
}