const express= require('express');
const app= express();
const path= require('path');
const router = require('./router/usersignup')
const sequel = require('./util/userdatabase');

const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/',router);

sequel.sync().then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});

