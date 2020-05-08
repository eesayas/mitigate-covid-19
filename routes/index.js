const express = require('express');
const router = express.Router();
const https = require('https');
const moment = require('moment');
const { landing, country } = require('../controllers');
const { getCountryData } = require('../controllers/service');

// these will render a view
router.get('/', landing);
router.get('/:country', country);

// the following work as services (ie. do NOT render a view)
router.get('/get-country-data/:country', getCountryData);

module.exports = router;