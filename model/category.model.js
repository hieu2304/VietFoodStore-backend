const knex = require('../util/knex');
const _ = require('lodash');

async function getAll() {
    const data = await knex('categories');
    return data;
}

async function getAllSubCategory() {
    const data = await knex('categories').whereNot({
        father_id: 0
    });
    return data;
}

async function getListSubCategoryByFatherId(fatherId) {
    const data = await knex('categories').where('father_id', fatherId);
    return data;
}

async function getAllFatherCategory() {
    const data = await knex('categories').where('father_id', 0).orWhere('father_id', null).orderBy('id');
    return data;
}

async function findById(id) {
    const data = await knex('categories').where('id', id);
    if(data.length === 0) {
        return null;
    }
    return data[0];
}

async function findByFatherId(id) {
    const data = await knex('categories').where({
        'id': id,
        'father_id': 0
    });
    if(data.length === 0) {
        return null;
    }
    return data[0];
}

async function findByName(name) {
    const data = await knex('categories').where('name', name);
    if(data.length === 0) {
        return null;
    }
    return data[0];
}

async function add(category) {
    return knex('categories').insert(category);
}

async function deleteById(id) {
    return knex('categories').where('id', id).del();
}

async function update(id, categoryWithoutId) {
    return knex('categories').where('id', id).update(categoryWithoutId);
}
const findFatherWithLimit = async () => {
    const info = await knex('categories')
                    .distinctOn('father_id')
                    .whereNot({ father_id: null })
                    .limit(10)

    return info
}

const findAllFather = async () => {
    const info = await knex('categories')
                    .where({ father_id: null })

    return info
}

const findChild = async (cateFather) => {
    const info = await knex('categories')
                    .where({ father_id: cateFather })
    return info
}
const findwayCate = async (prodCategoryID) => {
    const info = await knex('categories')
		.where('id', prodCategoryID)
        return info;
}
module.exports = {
    getAll,
    findwayCate,
    findById,
    findChild,
    findAllFather,
    findFatherWithLimit,
    findByFatherId,
    add,
    deleteById,
    update,
    getAllFatherCategory,
    getAllSubCategory,
    findByName,
    getListSubCategoryByFatherId
};