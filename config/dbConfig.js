const mongoose=require('mongoose')

function dbConnect(){
    mongoose.set('strictQuery', false);
    mongoose.connect("mongodb://127.0.0.1:27017/gadgetzon").then(()=>{
        console.log("db connected")
    }).catch(err=>{
        console.log(er)
    })
}

module.exports=dbConnect