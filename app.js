const express= require('express');
const app= express();
const path= require('path');
const userRouter = require('./router/usersignup')
const purchaseRouter = require('./router/purchase')
const passeord = require('./router/recpassword')
const premiumFeatures = require('./router/premium_features')

// const premiumFeatures= require('./router/premiumFeatures')
const sequel = require('./util/userdatabase');
const cors = require('cors');
const bodyParser= require('body-parser');
const userlist = require('./models/user');
const expenselist = require('./models/expense');
const Order = require('./models/orders');
const forgotpassword = require('./models/forgotpassword');
const DownloadedFiles = require('./models/downloadedFiles');

app.use(express.static(path.join(__dirname, 'view')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', userRouter);
app.use('/purchase', purchaseRouter);
app.use('/password', passeord);
app.use('/premiumfeatures', premiumFeatures);



app.use(cors());

userlist.hasMany(expenselist);
expenselist.belongsTo(userlist);

userlist.hasMany(forgotpassword);
forgotpassword.belongsTo(userlist);



userlist.hasMany(Order);
Order.belongsTo(userlist);

userlist.hasMany(DownloadedFiles);
DownloadedFiles.belongsTo(userlist)

sequel.sync().then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});

