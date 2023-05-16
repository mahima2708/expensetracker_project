const express = require('express');
const router = express.Router();
const routecontrol = require('../controller/usercontrol');
router.get('/', routecontrol.postfile)
router.post('/signup', routecontrol.adduser);
router.post('/login',routecontrol.finduser);

module.exports = router;
