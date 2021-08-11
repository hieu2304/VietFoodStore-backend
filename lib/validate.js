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

module.exports.checkBillDetails = (data)=> {
    const schema = Joi.object().keys({ 
        accId:Joi.number().required(),
        billId:Joi.number().required(),
    }); 
    const result = schema.validate(data);
    return result;
}

module.exports.updateRole = (data)=> {
    const schema = Joi.object().keys({ 
        accId:Joi.number().required(),
        accRole:Joi.number().required(),
    }); 
    const result = schema.validate(data);
    return result;
}

module.exports.updatePassword = (data)=> {
    const schema = Joi.object().keys({ 
        accPassWord:Joi.string().required(),
        accConfirmPassword:Joi.string().required(),
    }); 
    const result = schema.validate(data);
    return result;
}