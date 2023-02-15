// const collection = require('../models/collection');
// const db=require('../config/connection')
const userModel = require('../models/userModel');

const banUserAccount=(req,res,next)=>{
    if(req.session.user){
    return new Promise(async(resolve, reject) => {
        let user=await userModel.findOne({email:req.session.user})
        // let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:req.session.user})
        if(user.ban){
           
           req.session.destroy();
           res.redirect('/login')
            
        }else{
            next()
        }  
    });
    }
    next()
}
module.exports=banUserAccount;