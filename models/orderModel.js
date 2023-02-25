const { ObjectId } = require('mongodb');
const mongoose=require('mongoose')
const orderSchema=mongoose.Schema({
    orderID:{
        type:String,
        required:true
    },
    userId:{
        type:ObjectId,
        required:true
    },
    orderDate:{
        type: Date,
        required:true
    },
    orderStatus:{
        type:Boolean,
        required:true,
        default:false
    },
    returnRequest:{
        type:Boolean,
        required:true,
        default:false
    },
    returnConfirm:{
        type:Boolean,
        required:true,
        default:false
    },
    returnCancel:{
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
        type:Object,
        required:true
    },
    paymentStatus:{
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
    subTotal:{
        type:Number,
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