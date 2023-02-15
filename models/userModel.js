const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    ban:{
        type:Boolean,
        required:true
    },
    wishlist:{
        type:Array,
        required:true
    },
    cart:{
        type:Array,
        required:true
    },
    address:{
        type:Array,
        required:true
    }
})

const userModel = mongoose.model('user', userSchema);

module.exports=userModel;