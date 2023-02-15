const mongoose=require('mongoose')

const categorySchema=mongoose.Schema({
    categoryname:{
        type:String,
        required:true
    },
    categoryStatus:{
        type:Boolean,
        required:true
    }
})
const categoryModel=mongoose.model('catogory',categorySchema)
module.exports=categoryModel;