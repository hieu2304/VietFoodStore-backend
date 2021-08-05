const express = require('express');
const controller = require('../controller/districts.controller');
const router = express.Router();

router.get('/',controller.getAll);
module.exports = router;