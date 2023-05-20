const express = require('express');
const router = express.Router();
const routecontrol = require('../controller/usercontrol');
router.get('/', routecontrol.postfile)
router.get('/view/loginpage.html',routecontrol.loginsend);
router.get('/signup.html',routecontrol.postfile);
router.get('/view/expensepage.html',routecontrol.expensepagesend);
router.get('/data',routecontrol.getdata);
router.post('/signup', routecontrol.adduser);
router.post('/login',routecontrol.login);
router.post('/expense',routecontrol.addexpense);
router.delete('/delete/:id',routecontrol.deleteentry);

module.exports = router;
