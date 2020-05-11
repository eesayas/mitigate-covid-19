const express = require('express');
const router = express.Router();
const { landingPage, homePage, timelinePage, reportPage, curvePage, indexReports } = require('../controllers');
const { getCountryData, getCountriesTotalData, getCountryCurveData } = require('../controllers/service');
const { asyncErrorHandler } = require('../middleware');

// these will render a view
router.get('/', landingPage);
router.get('/home', asyncErrorHandler(homePage));
router.get('/timeline', asyncErrorHandler(timelinePage));
router.get('/report', asyncErrorHandler(reportPage));
router.get('/curve', asyncErrorHandler(curvePage));
router.get('/reports', indexReports);

// the following work as services (ie. do NOT render a view)
router.get('/get-country-data/:country', asyncErrorHandler(getCountryData));
router.get('/get-countries-total-data', asyncErrorHandler(getCountriesTotalData));
router.get('/get-country-curve-data', asyncErrorHandler(getCountryCurveData));

module.exports = router;