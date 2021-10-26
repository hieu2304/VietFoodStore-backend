const knex = require('../util/knex');
const _ = require('lodash');

async function listCity() {
    const data = await knex('cities');
    return data;
}
async function listDistrict(cityId) {
    const data = await knex('districts').where('city_id', cityId);
    return data;
}
async function listWard(districtId, cityId) {
    const data = await knex('wards').where({ city_id: cityId, district_id: districtId });
    return data;
}
async function listDeliveries(accId) {
    const result = await knex.from('delivery_address').where({acc_id:accId});
    return result;
}
async function addCity(name) {
    const data = await knex('cities').insert(name).returning('id')
    return data[0];
}
async function addDistrict(name) {
    const data = await knex('districts').insert(name).returning('id')
    return data[0];
}
async function addWard(name) {
    const data = await knex('wards').insert(name).returning('id')
    return data[0];
}
async function addDelivery(name) {
    const data = await knex('delivery_address').insert(name).returning('id')
    return data[0];
}
async function updateCity(name, id) {
    const data = await knex('cities').update(name).where('id', id);
    return data[0];
}
async function updateDistrict(name, id) {
    const data = await knex('districts').update(name).where('id', id);
    return data[0];
}
async function updateWard(name, id) {
    const data = await knex('wards').update(name).where('id', id);
    return data[0];
}
async function updateDelivery(name, id) {
    const data = await knex('delivery_address').update(name).where('id', id);
    return data[0];
}
async function deleteCity(id) {
    const data = await knex('cities').where('id', id).del();
    return data[0];
}
async function deleteDistrict(id) {
    const data = await knex('districts').where('id', id).del();
    return data[0];
}
async function deleteWard(id) {
    const data = await knex('wards').where('id', id).del();
    return data[0];
}
async function deleteDelivery(id) {
    const data = await knex('delivery_address').where('id', id).del();
    return data[0];
}
async function getNameCity(id){
    const data = await knex('cities').where('id', id).returning('name');
    return data[0].name;
}
async function getNameDistrict(id){
    const data = await knex('districts').where('id', id).returning('name');
    return data[0].name;
}
async function getNameWard(id){
    const data = await knex('wards').where('id', id).returning('name');
    return data[0].name;
}
async function findWardById(wardId) {
    const info = await knex('wards')
					.where({ id: wardId })
	return info
}
module.exports = {
    listCity,
    listDistrict,
    listWard,
    listDeliveries,
    addCity,
    addWard,
    addDistrict,
    addDelivery,
    updateCity,
    updateWard,
    updateDistrict,
    updateDelivery,
    deleteCity,
    deleteWard,
    deleteDistrict,
    deleteDelivery,
    getNameCity,
    getNameDistrict,
    getNameWard,
    findWardById,
};