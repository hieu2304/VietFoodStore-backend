const express = require('express');
const controller = require('../controller/delivery-address.controller');
const router = express.Router();

router.get('/list-cities',controller.getListCity);
router.post('/list-districts',controller.getListDistrict);
router.post('/list-ward',controller.getListWard);
router.post('/list-deliveries',controller.getListDelivery);
router.post('/add-delivery',controller.addDelivery);
module.exports = router;