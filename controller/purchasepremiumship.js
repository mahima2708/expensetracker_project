const razorpay= require('razorpay')
require('dotenv').config();
const order = require('../models/orders');
const Order = require('../models/orders');




exports.purchasepremiumship = async(req,res)=>{
    try{
        var rzp = new razorpay (
            {
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        
        const amount = 100;
        rzp.orders.create({amount, currency: "INR"},(err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            console.log("****************", req.user)
            req.user.createOrder({ orderid: order.id, status: 'pending'}).then(()=>{
                return res.status(201).json({order,key_id:rzp.key_id})
            }).catch(err=>{
                throw new Error(err)
            })
        })

    }catch(err){
        console.log(err);
        res.status(403).json({message: 'something went wrong', error:err})
    }
}

exports.updateTransaction= async (req,res)=>{
    try{
        const {payment_id , order_id}= req.body;
        const order = await  Order.findOne({where : {orderid : order_id}})
        const promise1 = order.update({ paymentid: payment_id, status: 'Successful'})
        const promise2 =  req.user.update({ ispremiumuser: true})

        Promise.all([promise1, promise2]).then(()=>{
            return res.status(202).json({ success: true,  message: "Transaction successful"});
        }).catch((error)=>{
            throw new Error(error)
        })
       
    }
    catch(err){
console.log(err);
    }
}

exports.updateTransactionstatus= async (req,res)=>{
    try{
        const {payment_id , order_id}= req.body;
      const order = await Order.findOne({where : {orderid : order_id}})
      const promise1 = order.update({ paymentid: payment_id, status: 'Failed'})
      const promise2 =  req.user.update({ ispremiumuser: false})

      Promise.all([promise1, promise2]).then(()=>{
        return res.status(202).json({ success: false,  message: "Transaction failed"});
      }).catch((error)=>{
        throw new Error(error)
      })
                    
                
    }
    catch(err){
console.log(err);
    }
}


          
