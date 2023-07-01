const sib = require('sib-api-v3-sdk');
require('dotenv').config()
const uuid = require('uuid');
const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');
const { UUIDV4 } = require('sequelize');
const path = require('path');
const bcrypt = require('bcrypt');



const client = sib.ApiClient.instance

const apiKey = client.authentications['api-key']
const transEmailApi =  new sib.TransactionalEmailsApi()


exports.sendmail = async (req,res,next)=>{
    try{

    const email  =  req.body.email;
    console.log("&&&&&&&&&". email);
        const user = await User.findOne({where : { emailid:email }});
        console.log("#######", user);
        if(user){
           // console.log("#######", user);
            const id = uuid.v4();
            user.createForgotpassword({id: id, isActive: true})
            .catch(err =>{
                throw new Error(err)
            })
            apiKey.apiKey = process.env.API_KEY

const sender = {
    email: 'mhtamta5@gmail.com'
}

const recievers = [
    {
        email:req.body.email
    }
]

transEmailApi
.sendTransacEmail({
    sender,
    to : recievers,
    subject: 'Reset Password',
    textContent:'Reset your password via the link provided below.',
    htmlContent: `<a href ="http://13.127.45.135:3000/password/resetpassword/${id}">Reset Password</a>`

}).then(response=>{
    console.log("!!!!!!!!!!!!!!!",response)

     return res.status(200).json({message: 'Link to reset password sent to your mail ', sucess: true})
})
.catch(err=>{
    throw new Error(err);
})
}
else{
    throw new Error('User doesnt exist')
}
}
catch(err){
    console.error(err)
    return res.json({ message: err, sucess: false });
}
}

exports.resetpassword = async (req,res,next)=>{
    const id = req.params.id;
    Forgotpassword.findOne({where: {id:id}}).then(passwordrequests=>{
           if(passwordrequests){
            passwordrequests.update({ isActive: false});
            const resetFile = path.join(__dirname,'../view/resetPassword.html');
            res.status(200).sendFile(resetFile);


            //res.end()
           }


    })
    
}

exports.updatePassword = async (req,res,next)=>{
    console.log("$%$%%$%$%", req.body);
    const id = req.body.id;
   const user = await Forgotpassword.findOne({where: {id:id}, attributes: ['userId']})
    console.log("%#%%#%#%#355",user.userId);
    const updatedPassword = req.body.newpassword;
    if(user){
    const saltrounds = 10;
    bcrypt.hash(updatedPassword, saltrounds , async(err,hash)=>{
        if(err){
            console.log(err);
        }
        else{
       await User.update({password:hash}, { where:
         
        {'id':user.userId}}
         );
       res.status(200).json({message: 'password got updated'});
        }

    })
}
else {
    res.status(404).json({message:'UserNot Found'})
}


}
