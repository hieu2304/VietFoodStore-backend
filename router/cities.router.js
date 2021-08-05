const express = require('express');
const controller = require('../controller/cities.controller');
const router = express.Router();

router.get('/',controller.getAll);
module.exports = router;