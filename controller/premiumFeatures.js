
const UserServices = require('../services/userservices');
const S3services = require('../services/s3Services');
const downloadedUrls = require('../models/downloadedFiles');
const users = require('../models/user');



exports.downloadexpenses = async (req,res,next) =>{
    try{
        const expenses = await UserServices.getexpenses(req);
       //console.log("**********&&&&&&&&&&", expenses);
       const Expensesjson = JSON.stringify(expenses);
       const UserId = req.user.id;
       const fileName = `Expenses${UserId}/${new Date()}.txt`;
       const fileUrl = await S3services.uploadToS3( Expensesjson , fileName);
       const Urls = await downloadedUrls.create({ fileUrl:fileUrl , userId: req.user.id});
       res.status(200).json({fileUrl, success: true});
    }catch(err){
         res.status(500).json({fileUrl: '', success: false, error: err});
    }

}

exports.downloadedUrl = async (req,res,next) =>{

    await downloadedUrls.findAll({where :{userId: req.user.id}}).then((response)=>{
        const sqldata=[];
        response.forEach((item)=>{
            sqldata.push({
                id:item.id,
                fileUrl:item.fileUrl,
              
            })
          
        })
        res.status(200).json({newentry:sqldata});
    }).catch((error)=>{
        res.status(404).json({error:error});
    });
}

exports.fetcHdata = async (req,res)=>{
   
    try {
        const entry= []
        const user = await users.findAll({
            attributes: ['id', 'name', 'total_expense'],
            order:  [['total_expense','DESC']]
        });
        
        user.forEach(item=>{
            entry.push({
              id: item.dataValues.id,
              name: item.dataValues.name,
              total_price: item.dataValues.total_expense
            });
        } )
        res.status(200).json({ entry });
        
    } catch (error) {
       throw new Error(error)
    }
  
}
