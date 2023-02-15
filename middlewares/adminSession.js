const adminVerify=(req,res,next)=>{
    if(req.session.admin){
        next()
    }else{
        res.redirect('/admin/adminLogin')
    }
    // next()
}
module.exports=adminVerify