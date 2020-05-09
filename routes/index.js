const express = require('express');
const router = express.Router();
const https = require('https');
const moment = require('moment');
const { landingPage, homePage, timelinePage, report } = require('../controllers');
const { getCountryData } = require('../controllers/service');

// these will render a view
router.get('/', landingPage);
router.get('/home', homePage);
router.get('/timeline', timelinePage);
router.get('/:country/report', report);

// the following work as services (ie. do NOT render a view)
router.get('/get-country-data/:country', getCountryData);

module.exports = router;