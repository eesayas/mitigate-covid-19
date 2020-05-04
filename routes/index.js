const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', { title: 'MITIGATE COVID-19' });
});

module.exports = router;
