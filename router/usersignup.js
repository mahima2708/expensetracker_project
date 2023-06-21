const express = require('express');
const router = express.Router();
const routecontrol = require('../controller/usercontrol');
const userauthenticate = require('../middleware/auth');
router.get('/', routecontrol.postfile)
router.get('/loginpage.html',routecontrol.loginsend);
router.get('/signup.html',routecontrol.postfile);
router.get('/expensepage',routecontrol.expensepagesend);
router.get('/recoverPassword', routecontrol.recoverPage);
router.get('/data' , userauthenticate.authorisation ,routecontrol.getdata);
router.get('/monthlydata' , userauthenticate.authorisation ,routecontrol.getmonthlyData);
router.get('/yearlydata' , userauthenticate.authorisation ,routecontrol.getyearlyData);
router.post('/signup', routecontrol.adduser);
router.post('/login',routecontrol.login);
router.post('/expense',userauthenticate.authorisation, routecontrol.addexpense);
router.delete('/delete/:id',userauthenticate.authorisation, routecontrol.deleteentry);


module.exports = router;
