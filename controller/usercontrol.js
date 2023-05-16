const path = require('path');
const express = require('express');
const table= require('../models/user');

exports.postfile= (req,res,next)=>{
    const filepath = path.join(__dirname,'../view/loginpage.html');
    res.sendFile(filepath);
}

exports.adduser= async(req,res,next)=>{
    console.log(req.body);
    try{
    const name = req.body.username;
    const email= req.body.email;
    const password = req.body.password;
    const data = await table.create({
        name:name,
        emailid:email,
        password:password
    });
    res.status(200).json({newdata: data})
}
catch(err){
console.log(err);
}
}

exports.finduser= async(req,res,next)=>{
        try {
            const email= req.body.email;
            const password= req.body.password;
            const emailCheck = await table.findOne({
                where: {
                  emailid: email
                }
              });
        if(!emailCheck){
            res.status(200).json({newdataEntry:"User not found redirect to sign up page"})
        }
        else{
            const entry = await table.findOne({
                where: {
                  emailid: email,
                  password: password
                }
              });
        if (!entry) {
            res.status(200).json({newdataEntry:"Password is not matching"})
           // return;
              }
        else 
              {
                res.status(200).json({newdataEntry: "user registered"})
              }
        }
          
        } catch (error) {
          console.error('Error retrieving entry:', error);
        }
      }
  