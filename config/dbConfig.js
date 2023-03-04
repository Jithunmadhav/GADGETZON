const mongoose=require('mongoose')

function dbConnect(){
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MONGOOSE_CONNECT).then(()=>{
        console.log("db connected")
    }).catch(err=>{
        console.log(err)
    })
}

module.exports=dbConnect