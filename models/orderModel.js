const mongoose=require('mongoose')
const orderSchema=mongoose.Schema({
    orderId:{
        type:Number,
        required:true
    },
    orderDate:{
        type:Date,
        required:true
    },
    orderStatus:{
        type:Boolean,
        required:true
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
    }

})
const adminModel = mongoose.model('orders', orderSchema);
module.exports=adminModel