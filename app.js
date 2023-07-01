const express= require('express');
const app= express();
const path= require('path');
const userRouter = require('./router/usersignup')
const purchaseRouter = require('./router/purchase')
const passeord = require('./router/recpassword')
const premiumFeatures = require('./router/premium_features')
const  helmet = require('helmet')
const morgan = require('morgan');
const fs = require('fs')

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
app.use(helmet());
const logstream = fs.createWriteStream(path.join(__dirname, './error.log'), {flags: 'a'});
app.use(morgan('combined', {stream: logstream}));

userlist.hasMany(expenselist);
expenselist.belongsTo(userlist);

userlist.hasMany(forgotpassword);
forgotpassword.belongsTo(userlist);



userlist.hasMany(Order);
Order.belongsTo(userlist);

userlist.hasMany(DownloadedFiles);
DownloadedFiles.belongsTo(userlist)



app.use((err, req, res, next) => {
  // Log the error
  console.error(err);
  next(err);
});

sequel.sync().then(result => {
    app.listen(3000);
    
})
.catch(err => {
    console.log(err);
});

