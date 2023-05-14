const express = require('express');
const router = express.Router();
const routecontrol = require('../controller/usercontrol');
router.post('/', routecontrol.adduser);

module.exports = router;
