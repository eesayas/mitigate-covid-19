const express = require('express');
const router = express.Router();
const https = require('https');
const moment = require('moment');
const { landingPage, homePage, timelinePage, reportPage, curvePage } = require('../controllers');
const { getCountryData, getCountryTotalData, getCountriesTotalData } = require('../controllers/service');
const { asyncErrorHandler } = require('../middleware');

// these will render a view
router.get('/', landingPage);
router.get('/home', homePage);
router.get('/timeline', timelinePage);
router.get('/report', asyncErrorHandler(reportPage));
router.get('/curve', asyncErrorHandler(curvePage));

// the following work as services (ie. do NOT render a view)
router.get('/get-country-data/:country', getCountryData);
router.get('/get-country-total-data/:country', getCountryTotalData);
router.get('/get-countries-total-data', asyncErrorHandler(getCountriesTotalData));

module.exports = router;