const Joi = require('joi');

module.exports.checkAuth = (data)=> {
    const schema = Joi.object().keys({ 
        email:Joi.string().required(),
        passWord: Joi.string().required(), 
    }); 
    const result = schema.validate(data);
    return result;
}

module.exports.checkAccountUpdateStatus = (data)=> {
    const schema = Joi.object().keys({ 
        accId:Joi.number().required(),
        accStatus: Joi.number().required(), 
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
        // accId:Joi.number().required(),
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
        acc_id: Joi.number(), 
        vote:Joi.number().required(),
        content:Joi.string().required()
    }); 
    const result = schema.validate(data);
    return result;
}

module.exports.checkUpdateComment = (data)=> {
    const schema = Joi.object().keys({ 
        commentID: Joi.number().required(), 
        vote: Joi.number().required(),
        content: Joi.string().required()
    }); 
    const result = schema.validate(data);
    return result;
}

module.exports.checkCategoryAddFather = (data)=> {
    const schema = Joi.object().keys({ 
        category_name:Joi.string().required(),
        sub_category:Joi.array().required(),
    }); 
    const result = schema.validate(data);
    return result;
}

module.exports.checkCategoryAddSubByFatherId = (data)=> {
    const schema = Joi.object().keys({ 
        cateFather:Joi.number().required(),
        cateName:Joi.string().required(),
    }); 
    const result = schema.validate(data);
    return result;
}

module.exports.checkCategoryUpdate = (data)=> {
    const schema = Joi.object().keys({ 
        cateId:Joi.number().required(),
        cateName:Joi.string().required(),
        cateFather:Joi.number()
    }); 
    const result = schema.validate(data);
    return result;
}

// Bill
module.exports.checkBillAdd = (data)=> {
    const schema = Joi.object().keys({ 
        accAddress:Joi.string().required(),
        priceShip:Joi.string().required(),
        receiverName:Joi.string().required(),
        receiverPhone:Joi.string().required(),
        receiverNote:Joi.string().required(),
        listProduct:Joi.array().required()
    }); 
    const result = schema.validate(data);
    return result;
}