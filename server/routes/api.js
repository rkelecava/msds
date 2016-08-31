var express = require('express');
var router = express.Router();

/* /api/safetySheets */
var safetySheet = require('./partials/safetySheets');
safetySheet.register(router, '/safetySheets');

module.exports = router;