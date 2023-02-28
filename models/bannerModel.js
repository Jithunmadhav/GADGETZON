const mongoose=require('mongoose')

const bannerSchema=mongoose.Schema({
    bannerName:{
        type:String,
        required:true
    },
    main_image:{
        type:Array,
        required:true
    }
})
const bannerModel=mongoose.model('banner',bannerSchema)
module.exports=bannerModel;