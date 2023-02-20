const { ObjectId } = require('mongodb');
const mongoose=require('mongoose')
const orderSchema=mongoose.Schema({
    userId:{
        type:ObjectId,
        required:true
    },
    orderDate:{
        type:String,
        required:true
    },
    orderStatus:{
        type:Boolean,
        required:true,
        default:false
    },
    returnStatus:{
        type:Boolean,
        required:true,
        default:false
    },
    cancelStatus:{
        type:Boolean,
        required:true,
        default:false
    },
    address:{
        type:String,
        required:true
    },
    paymentStatus:{
        type:Boolean,
        required:true
    },
    payment:{
        type:String,
        required:true
    },
    products:{
        type:Array,
        required:true
    }, 
    couponStat:{
        type:Boolean,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    dispatch:{
        type:String,
        default: new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString()
    }

})
const adminModel = mongoose.model('orders', orderSchema);
module.exports=adminModel