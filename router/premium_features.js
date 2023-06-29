const express = require('express');
const router = express.Router();
const authenticatemiddleware = require('../middleware/auth');
const routecontrol = require('../controller/premiumFeatures');

router.get('/download', authenticatemiddleware.authorisation, routecontrol.downloadexpenses)
router.get('/getData', authenticatemiddleware.authorisation, routecontrol.downloadedUrl)
router.get('/premiumuserdata',authenticatemiddleware.authorisation,routecontrol.fetcHdata);

module.exports= router;