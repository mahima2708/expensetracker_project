const path = require('path');
const express = require('express');
const table= require('../models/user');
const expensetable= require('../models/expense');
const bcrypt = require('bcrypt');
const token= require('jsonwebtoken');
const sequel = require('../util/userdatabase')
const { Op } = require('sequelize');

exports.loginsend=(req,res,next)=>{
  const file= path.join(__dirname,'../view/loginpage.html');
  res.sendFile(file);
}

exports.postfile= (req,res,next)=>{
    const filepath = path.join(__dirname,'../view/signup.html');
    res.sendFile(filepath);
}
exports.expensepagesend=(req,res,next)=>{
  const expensefile= path.join(__dirname,'../view/test.html');
  res.sendFile(expensefile);
}
exports.recoverPage=(req,res,next)=>{
  const recoveryFile= path.join(__dirname,'../view/recoverPassword.html');
  res.sendFile(recoveryFile);
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
        password:hash,
        userId: req.user
    });
    res.status(200).json({newdata: data})
    })   
}
catch(err){
console.log(err);
}
}
function generateToken(id,name){
  return token.sign({userId:id,name:name}, '45$545778%576565');
}
exports.login= async(req,res,next)=>{
        try {
            const email= req.body.email;
            const password= req.body.password;
            const emailCheck = await table.findOne({
                where: {
                  emailid: email                }
              });
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
              console.log("###",emailCheck)
             bcrypt.compare( password,emailCheck.password, (err,result)=>{
              console.log("#$#$#", result);
              if (result==true) {
                 res.status(200).json({success: true ,message:"User logged in successfully",token: generateToken(emailCheck.id,emailCheck.name)})
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
      
      
exports.addexpense= async(req,res,next)=>{
  //console.log("***",req.param)
  const t = await sequel.transaction();
        try{
          const idval= req.user.id;
          const price = req.body.price;
          const description= req.body.description;
          const category = req.body.category;
            const data = await expensetable.create({
             price:price,
             description:description,
             category:category,
             userId:req.user.id
          }, {transaction : t}).then(expense =>{
            const totalexpense = Number(req.user.total_expense)+ Number(price);
            table.update({
              total_expense:totalexpense
            },{
              where: {id: req.user.id},
              transaction: t
            }).then(async()=>{
              await t.commit()
              res.status(200).json({expense:expense})
            })
            .catch(async (err)=>{
              await t.rollback()
              return res.status(500).json({success: false, error:err})
            })
          }).catch(async (err)=>{
            await t.rollback()
            return res.status(500).json({success: false, error:err})
          })
          // res.status(200).json({newdata: data}) 
      }
      catch(err){
      console.log(err);
      }
      }
     
      exports.getdata= async (req,res,next)=>{

        //   where: {
        //     createdAt: {
        //       [Op.between]: [startdate, enddate]
        //     }
        //   }
        // })
        const list_perpage = req.query.listperPage;
        const num = parseInt(list_perpage);

        console.log("request from frontend", req.query)
        const dateString = req.query.date;
        const dateObj = new Date(dateString);
        const date = dateObj.toISOString().split('T')[0];
        console.log("Date:", date);
        const dateToFetch = date;

        const startTime = new Date(dateToFetch);
        const endTime = new Date(dateToFetch);
        endTime.setDate(endTime.getDate() + 1); 
        console.log("@#@#@#", startTime );
        console.log("@@@", endTime );

        const ordertable = await table.findOne({where: {id: req.user.id}})
        const totalExpenditure = await expensetable.sum('price',{
          where: {
            userId: req.user.id,
            createdAt: {
              [Op.gte]: startTime,
              [Op.lte]: endTime
            }
          }
        })

        const page = +req.query.page || 1;
        let totalList;
        await expensetable.count({
          where: {
            userId: req.user.id,
           createdAt: {
              [Op.gte]: startTime,
              [Op.lte]: endTime
            }
          }
        }).then((total) =>{
          totalList = total;
          return expensetable.findAll({
            offset: (page - 1) * num,
            limit: num,
            where :
            {userId: req.user.id, 
              createdAt: {
                [Op.gte]: startTime,
                [Op.lte]: endTime
              }}}).then((response)=>{
                console.log("*&**&",response)
                console.log("@@@ total list", totalList);
            const sqldata=[];
            response.forEach((item)=>{
                sqldata.push({
                    id:item.id,
                    price:item.price,
                    description:item.description,
                    category:item.category,  
                })
                
              
            }) 
            res.status(201).json({
              newentry:sqldata,
               ispremiumuser: ordertable.ispremiumuser, 
               totalExpenditure:totalExpenditure,
               currentPage: page,
               hasNextPage: num*page < totalList,
               nextPage: page + 1,
               hasPreviousPage: page >1,
               previousPage: page-1,
               lastPage: Math.ceil(totalList/num)
              });
        })
        }).catch((error)=>{
            res.status(404).json({error:error});
        });
        
       
    }

    exports.deleteentry = async(req,res,next)=>{
      const t = await sequel.transaction()
       const id= req.params.id;
       const price = req.query.price
       console.log("***%%%%%%", price);

       expensetable.destroy({
        where:{
          "id": id,
          userId: req.user.id
        }
       },{ transaction:t}).then((noofrows)=>{
        if(noofrows===0){
          return res.status(404).json({success: false, message: 'Expense dosent belongs to the user'})
        }
        const totalexpense = Number(req.user.total_expense)-Number(price);
        table.update({
          total_expense:totalexpense
        },{
          where: {id: req.user.id},
          transaction :t 
        }).then(async()=>{
          await t.commit()
          return res.status(200).json({success: true, message:'Deleted successfully'})
        })
        .catch(async (err)=>{
          await t.rollback()
          return res.status(500).json({success: false, error:err})
        })
        // return res.status(200).json({success: true, message:'Deleted successfully'})
      
       }).catch(async(err)=>{
        await t.rollback()
        console.log(err);
        res.status(500).json({success:true, message:'failed'});
       })
    }

    exports.getmonthlyData = async (req,res,next)=>{
      console.log("request", req.query.month);
      const test = req.query.month;
      const list_perpage = req.query.noofrows
      const num = parseInt(list_perpage);
      const Month = test.split('/')[0];
      const year = test.split('/')[1];
      // const count = await expensetable.count()
      // .then((total)=>{
      //   totalList = total;
      // })
      
      const startdate = new Date(`${year}-${Month}-01`);
      const enddate = new Date(`${year}-${Month}-31`);

      const total_expense = await expensetable.sum('price', {
        where: {
          userId: req.user.id,
          createdAt: {
            [Op.between]: [startdate, enddate]
          }
        }
      })
      const page = +req.query.page || 1;
      let totalList;
      await expensetable.count({
        where :{
          userId: req.user.id,
          createdAt: {
            [Op.between]: [startdate, enddate]
          }
        }
      }).then((total) =>{
        totalList = total;
      return expensetable.findAll({
        offset: (page - 1) * num,
        limit: num,
        where: {
          userId: req.user.id,
          createdAt: {
            [Op.between]: [startdate, enddate]
          }
        }
      })
    }).then((response) =>{
        console.log("responseeeee",response);
        const monthwisedata=[];
        response.forEach((item)=>{
            monthwisedata.push({
                id:item.id,
                price:item.price,
                description:item.description,
                category:item.category,  
            })
          
        })
        console.log("*****total list***",totalList)
        res.status(201).json({
          newentry:monthwisedata, 
           total_expense: total_expense,
           currentPage: page,
           hasNextPage: num*page < totalList,
           nextPage: page + 1,
           hasPreviousPage: page >1,
           previousPage: page-1,
           lastPage: Math.ceil(totalList/num)
          });
       

      }).catch((err)=>{
        throw new Error(err);
      })


    }

    exports.getyearlyData = async(req,res,next)=>{
      console.log("request", req.query.year);
      const year = req.query.year;
      
      const startdate = new Date(`${year}-01-01`);
      const enddate = new Date(`${year}-12-31`);

      const yearlyExpenditure = await expensetable.sum('price', {
        where: {
          userId: req.user.id,
          createdAt: {
            [Op.between]: [startdate, enddate]
          }
        }
      })
      const list_perpage= req.query.noofRows
      const num = parseInt(list_perpage);
      const page = +req.query.page || 1;
      let totalList;
      await expensetable.count({
        where: {
          userId: req.user.id,
          createdAt: {
            [Op.between]: [startdate, enddate]
          }
        }

      }).then((total) =>{
        totalList = total;
      
      return expensetable.findAll({
        offset: (page - 1) * num,
        limit: num,
        where: {
          userId: req.user.id,
          createdAt: {
            [Op.between]: [startdate, enddate]
          }
        }
      })
    }).then((response) =>{
        console.log("responseeeee",response);
        const yearwisedata=[];
        response.forEach((item)=>{
            yearwisedata.push({
                id:item.id,
                price:item.price,
                description:item.description,
                category:item.category,  
            })
          
        })
        res.status(201).json({
          newentry:yearwisedata, 
           yearlyExpenditure : yearlyExpenditure ,
           currentPage: page,
           hasNextPage: num*page < totalList,
           nextPage: page + 1,
           hasPreviousPage: page >1,
           previousPage: page-1,
           lastPage: Math.ceil(totalList/num)
          });

      }).catch((err)=>{
        throw new Error(err);
      })

    }


  