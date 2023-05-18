const path = require('path');
const express = require('express');
const table= require('../models/user');
const bcrypt = require('bcrypt');

exports.loginsend=(req,res,next)=>{
  const file= path.join(__dirname,'../view/loginpage.html');
  res.sendFile(file);
}

exports.postfile= (req,res,next)=>{
    const filepath = path.join(__dirname,'../view/signup.html');
    res.sendFile(filepath);
}

exports.adduser= async(req,res,next)=>{
    console.log(req.body);
    try{
    const name = req.body.username;
    const email= req.body.email;
    const password = req.body.password;
    const saltrounds=10;
    bcrypt.hash (password, saltrounds , async(err,hash)=>{
      const data = await table.create({
        name:name,
        emailid:email,
        password:hash
    });
    res.status(200).json({newdata: data})
    })   
}
catch(err){
console.log(err);
}
}

exports.login= async(req,res,next)=>{
        try {
            const email= req.body.email;
            const password= req.body.password;
            const emailCheck = await table.findOne({
                where: {
                  emailid: email
                }
              });
              console.log("####",emailCheck.password);
        if(!emailCheck){
            res.status(404).json({success:false, message:"User not found"})
        }

        else{
            const entry = await table.findOne({
                where: {
                  emailid: email,
                  password: password
                }
              });
             bcrypt.compare( password,emailCheck.password, (err,result)=>{
              console.log("#$#$#", result);
              if (result==true) {
                 res.status(200).json({success: true , message:"User logged in successfully"})
               // return;
                  }
            else 
                  {
                    res.status(401).json({success: false , message: "Password incorrect"})
                  }
             })
       
        }
          
        } catch (error) {
          console.error('Error retrieving entry:', error);
        }
      }
  