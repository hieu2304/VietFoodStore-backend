const Delivery = require('../model/delivery-address.model');
const asyncHandler = require('express-async-handler');
const validate = require("../lib/validate");
const jwtHelper = require('../lib/jwt');

module.exports.getListCity = asyncHandler(async function (req, res, next) {
    let data = await Delivery.listCity();
    var listcities = [];
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            listcities.push({
                ci_id: data[i].id,
                ci_name: data[i].name,
                ci_created_date: new Date(),
                ci_updated_date: new Date()
            })
        }
        return res.status(200).json({
            listcities,
            statusCode: 0
        })
    }
    return res.status(400).json({
        listcities,
        statusCode: 1
    })
});

module.exports.getListDistrict = asyncHandler(async function (req, res, next) {
    const id = req.body.cityId;
    let data = await Delivery.listDistrict(id);
    var listDistricts = [];
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            listDistricts.push({
                dis_id: data[i].id,
                dis_name: data[i].name,
                dis_city_id: data[i].city_id,
                dis_created_date: new Date(),
                dis_updated_date: new Date()
            })
        }
        return res.status(200).json({
            listDistricts,
            statusCode: 0
        })
    }
    return res.status(400).json({
        listDistricts,
        statusCode: 1
    })
});

module.exports.getListWard = asyncHandler(async function (req, res, next) {
    const id = req.body.cityId;
    const disId = req.body.districtId;
    let data = await Delivery.listWard(disId,id);
    var listcities = [];
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            listcities.push({
                ward_id: data[i].id,
                ward_name: data[i].name,
                ward_city_id: data[i].city_id,
                ward_dis_id: data[i].distric_id,
                ward_created_date: new Date(),
                ward_updated_date: new Date()
            })
        }
        return res.status(200).json({
            listcities,
            statusCode: 0
        })
    }
    return res.status(400).json({
        listcities,
        statusCode: 1
    })
});

module.exports.getListDelivery = asyncHandler(async function (req, res, next) {
    const accid = req.body.accId
    let data = await Delivery.listDeliveries(accid);
    var listDeliveries = [];
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            listDeliveries.push({
                del_id: data[i].id,
                del_detail_address: data[i].detail_address,
                del_district_id: data[i].dis_id,
                del_city_id: data[i].city_id,
                del_ward_id:data[i].ward_id,
                del_user_id:data[i].acc_id,
                del_status:data[i].status,
                ci_name:await Delivery.getNameCity(data[i].city_id),
                dis_name:await Delivery.getNameDistrict(data[i].dis_id)
            })
        }
        return res.status(200).json({
            listDeliveries,
            statusCode: 0
        })
    }
    return res.status(400).json({
        listDeliveries,
        statusCode: 1
    })
});

module.exports.addDelivery = asyncHandler(async function (req, res, next) {
    const { wardId, delDetailAddress } = req.body
    let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }
    const checkWards = await Delivery.findWardById(wardId)
    const newDelivery = {
		city_id: checkWards[0].ward_city_id,
		district_id: checkWards[0].ward_dis_id,
		ward_id: wardId, 
		detail_address: delDetailAddress, 
		acc_id: currentUser.accId
	}
    const returnInfo = await Delivery.addDelivery(newDelivery)
    return res.status(200).json({
		delId: returnInfo[0],
		statusCode: successCode
	})
});