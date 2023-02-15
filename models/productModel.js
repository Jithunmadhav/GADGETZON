const mongoose = require('mongoose')

const productSchema=mongoose.Schema({
    productname:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    quandity:{
        type:Number,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    discription:{
        type:String,
        required:true
    },
    discription2:{
        type:String,
        required:true
    },
    main_image:{
        type:Array,
        required:true
    },
    sub_image:{
        type:Array,
        required:true
    },
    productStatus:{
        type:Boolean,
        required:true
    },
    wlStatus:{
        type:Boolean,
        required:true
    },
    stockStatus:{
        type:Boolean,
        required:true
    }
    

})
const productModel = mongoose.model('products', productSchema);
module.exports=productModel