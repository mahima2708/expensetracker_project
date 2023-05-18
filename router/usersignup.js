const express = require('express');
const router = express.Router();
const routecontrol = require('../controller/usercontrol');
router.get('/', routecontrol.postfile)
router.get('/view/loginpage.html',routecontrol.loginsend);
router.get('/signup.html',routecontrol.postfile);
router.post('/signup', routecontrol.adduser);
router.post('/login',routecontrol.login);

module.exports = router;
