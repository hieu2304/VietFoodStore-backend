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
        userName:Joi.string()
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

module.exports.checkAddComment = (data)=> {
    const schema = Joi.object().keys({ 
        prod_id:Joi.number().required(),
        acc_id: Joi.number().required(), 
        status: Joi.number().required(), 
        vote:Joi.number().required(),
        content:Joi.string().required()
    }); 
    const result = schema.validate(data);
    return result;
}