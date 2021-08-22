const Category = require('../model/category.model');
const asyncHandler = require('express-async-handler');
const validate = require("../lib/validate");

module.exports.getAll = asyncHandler(async function (req, res, next) {
    let result = await Category.getAll();
    if (!result) return res.status(400).send({
        message: 'Get categories failed',
        statusCode: 1
    });
    return res.status(200).send({
        listCategory: result,
        statusCode: 0
    });
});

//list father
module.exports.getAllFatherCategory = asyncHandler(async function (req, res, next) {
    let result = await Category.getAllFatherCategory();
    if (!result) return res.status(400).send({
        message: 'Get categories failed',
        statusCode: 1
    });
    return res.status(200).send({
        listCategory: result,
        statusCode: 0
    });
});

module.exports.getAllSubCategory = asyncHandler(async function (req, res, next) {
    let result = await Category.getAllSubCategory();
    if (!result) return res.status(400).send({
        message: 'Get categories failed',
        statusCode: 1
    });
    return res.status(200).send({
        subCategories: result,
        statusCode: 0
    });
});

//list
module.exports.getAllFatherSubCategory = asyncHandler(async function (req, res, next) {
    let result = await Category.getAllFatherCategory();
    if (!result) return res.status(400).send({
        message: 'Get categories failed',
        statusCode: 1
    });
    const listCategory = [];

    for (var i = 0; i < result.length; i++) {
        const listSubCategory = await Category.getListSubCategoryByFatherId(result[i].id);
        listCategory.push({
            id: result[i].id,
            name: result[i].name,
            father_id: result[i].father_id,
            subCategories: listSubCategory
        })
    }

    return res.status(200).send({
        subCategories: listCategory,
        statusCode: 0
    });
});

//list child
module.exports.getSubCategoryByFatherId = asyncHandler(async function (req, res, next) {
    const fatherId = + req.params.id || 0;
    const listSubCategory = await Category.getListSubCategoryByFatherId(fatherId);
    return res.status(200).send({
        subCategories: listSubCategory,
        statusCode: 0
    });
});


module.exports.getById = asyncHandler(async function (req, res, next) {
    let categoryId = + req.params.id || 0;
    let result = await Category.findById(categoryId);
    if (result === null) {
        return res.status(204).end();
    }
    return res.status(200).json({
        listCategory: result,
        statusCode: 0
    });
});



module.exports.add = asyncHandler(async function (req, res, next) {
    const category = req.body;
    category.create_date = new Date();
    const result = await Category.add(category);
    category.id = result[0];
    res.json(category);
});

module.exports.addFatherSubCategory = asyncHandler(async function (req, res, next) {
    //     category_name: 'category_new',
    //     sub_category: [{id: 2, name: 'category_sub1'}, {id: 3, name: 'category_sub2'}]
    try {
        const { error, value } = validate.checkCategoryAddFather(req.body);
        if (error) {
            res.status(422).json({
                message: 'Invalid request',
                data: req.body,
                statusCode: 1
            })
        } else {
            const fatherCategoryName = req.body.category_name;
            const fatherCategory = {
                name: fatherCategoryName,
                father_id: 0,
                create_date: new Date()
            }
            const result = await Category.add(fatherCategory);

            //get id father category
            const resultFatherCategory = await Category.findByName(fatherCategoryName);
            if (resultFatherCategory === null) {
                return res.status(204).json({
                    message: 'No get category',
                    statusCode: 1
                });
            }
            fatherCategoryId = resultFatherCategory.id;

            //update fatherid in sub_category
            const listSubCategory = req.body.sub_category;

            listSubCategory.forEach(async (element) => {
                let sub_cate = {
                    father_id: fatherCategoryId,
                    update_date: new Date()
                }
                await Category.update(element.id, sub_cate);
            });
        }
    } catch (error) {
        return res.status(404).json({
            message: error,
            statusCode: 1
        })
    }
    res.json({
        message: 'Category create success',
        statusCode: 0
    })
});

module.exports.addFatherCategory = asyncHandler(async function (req, res, next) {
    //POST:{name: 'father_category_name'}     
    const fatherCategoryName = req.body.name;
    const existFather = await Category.findByName(fatherCategoryName);
    //check exist father name. if no exist -> save
    if (existFather === null) {
        const fatherCategory = {
            name: fatherCategoryName,
            father_id: 0,
            create_date: new Date()
        }
        const result = await Category.add(fatherCategory);
    } else {
        return res.status(404).json({
            message: `${fatherCategoryName} is existed. Please add another name!`,
            statusCode: 1
        })
    }

    res.json({
        message: 'Father Category create success',
        statusCode: 0
    })
});

module.exports.addSubCategoryByFatherId = asyncHandler(async function (req, res, next) {
    //     father_id: '1',
    //     name: 'category_sub1'
    try {
        const { error, value } = validate.checkCategoryAddSubByFatherId(req.body);
        if (error) {
            res.status(422).json({
                message: 'Invalid request',
                data: req.body,
                statusCode: 1
            })
        } else {
            //get id father category
            const fatherId = req.body.father_id;
            const subNameCategory = req.body.name;
            const existFatherId = await Category.findByFatherId(fatherId);
            if (existFatherId === null) {
                return res.status(404).json({
                    message: 'No exist Father category',
                    statusCode: 1
                })
            }

            //add fatherid in sub_category
            let sub_cate = {
                name: subNameCategory,
                father_id: fatherId,
                create_date: new Date()
            }
            await Category.add(sub_cate);
        }
    } catch (error) {
        return res.status(404).json({
            message: error,
            statusCode: 1
        })
    }
    res.json({
        message: 'Category create success',
        statusCode: 0
    })
});

module.exports.delete = asyncHandler(async function (req, res, next) {
    let categoryId = + req.params.id || 0;
    let affectiveRow = await Category.deleteById(categoryId);
    if (affectiveRow === 0) {
        return res.json({
            message: "No category delete"
        });
    }
    res.json({
        message: 'Category deleted success'
    })
});

module.exports.updateFatherSubCategory = asyncHandler(async function (req, res, next) {
    // {
    //     cateID: '',
    //     cateName: '',
    //     cateFather; '' if TH cateFather(father_id) have-> update child by fatherId
    // }

    try {
        const { error, value } = validate.checkCategoryUpdate(req.body);
        if (error) {
            res.status(422).json({
                message: 'Invalid request',
                data: req.body,
                statusCode: 1
            })
        } else {
            if (req.body.cateFather == undefined) {
                //K truyen cateFather -> update name
                const category = {
                    name: req.body.cateName,
                    update_date: new Date()
                };
                const category_id = req.body.cateID
                const affective_rows = await Category.update(category_id, category);
                if (affective_rows === 0) {
                    return res.status(304).end();
                }

            } else {
                //update fatherid by cateId child
                const category = {
                    name: req.body.cateName,
                    update_date: new Date(),
                    father_id: req.body.cateFather
                };
                const category_id = req.body.cateID
                const affective_rows = await Category.update(category_id, category);
                if (affective_rows === 0) {
                    return res.status(304).end();
                }
            }
        }
    } catch (error) {
        return res.status(404).json({
            message: error,
            statusCode: 1
        })
    }
    res.json({
        message: 'Category update success',
        statusCode: 0
    })
});

module.exports.update = asyncHandler(async function (req, res, next) {
    const category = req.body;
    category.update_date = new Date();
    const category_id = req.body.id
    delete category.id;
    const affective_rows = await Category.update(category_id, category);
    if (affective_rows === 0) {
        return res.status(304).end();
    }
    res.json({
        statusCode: 0,
        message: 'Update category success',
        category
    });
});