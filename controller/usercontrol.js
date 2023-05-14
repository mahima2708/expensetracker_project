const express = require('express');
const table= require('../models/user');

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