
const nodemailer = require("nodemailer");
module.exports={
 
  successMail:(email,name)=> {
      return new Promise((resolve, reject)=>{
      let password="nxkfijtymujdbmtq"
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "gadgetzonnn@gmail.com",
            pass: password
        }
    });
    var mailOptions = {
        from:"gadgetzonnn@gmail.com",
        to: email,
        subject: "GADGETZON order confimation",
        html: `   <h1> Hi ${name} <h1>
                  <h2>Your order has been placed successfully</h2>
                   
                   
                 `
    };
    transporter.sendMail(mailOptions,(err,res)=>{
        if(err){
            console.log(err);
        }
        else {
    
        }
    });
      })
      
  }
}

 

//  let Otp=Math.floor(Math.random()*1000000)
//  sentOTP("j9446244318@gmail.com",Otp).then(()=>{
//   console.log("email sent successfully");
//  }).catch(err=>{
//   console.log(err);
//  })
