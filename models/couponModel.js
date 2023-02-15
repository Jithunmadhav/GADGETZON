const mongoose=require('mongoose')
const couponSchema=mongoose.Schema({
    couponName:{
        type:String,
        required:true
    },
    couponCode:{
        type:String,
        required:true
    },
    discountAmt:{
        type:Number,
        required:true
    },
    minPurchaseAmt:{
        type:Number,
        required:true
    },
    createdDate:{
        type:Date,
        default:Date.now(),
        required:true
    },
    expDate:{
        type:Date,
        required:true
    },
    couponStatus:{
        type:Boolean,
        required:true
    }


    
})

const couponModel=mongoose.model('coupon',couponSchema)
module.exports=couponModel;