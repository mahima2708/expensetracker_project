const express= require('express');
const app= express();
const path= require('path');
const router = require('./router/usersignup')
const sequel = require('./util/userdatabase');
const cors = require('cors');
const bodyParser= require('body-parser');
const userlist = require('./models/user');
const expenselist = require('./models/expense');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/',router);
app.use(cors());
userlist.hasMany(expenselist)
expenselist.belongsTo(userlist)
sequel.sync().then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});

