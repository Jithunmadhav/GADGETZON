const { response } = require('express')
const express =require('express')
const helper=require('../helpers/sentOTP')
const { use } = require('../routes/admins')
const user = require('../Services/user')

const router=express.Router()

module.exports={
    // Home-page

    getHome:(req,res)=>{
        let userstatus= req.session.userStatus;
        let username=req.session.username;
        
            res.render('homepage',{userstatus,username})
            req.session.userStatus=false;
        
    },

    // user-login-page
    getLogin:(req,res)=>{
      
        let resultBan=req.session.Boolean
        let resultInvalid=req.session.status
      
        res.render('userLogin',{resultBan,resultInvalid})
    
        req.session.Boolean=false;
        req.session.status=false;
    },
 
    postLogin:(req,res)=>{
        
        user.userLogin(req.body).then((response)=>{
            console.log(response.status);
            if(response.status == true && response.Boolean==false){ 
            req.session.user=response.user.email
            req.session.username=response.user.fname
            req.session.userID=response.user._id;
            req.session.userStatus=true;
            //    let Otp=Math.floor(Math.random()*1000000)
            //    req.session.loginOTP=Otp;
            //    req.session.loginEmail=req.body.email;
            //    helper.sentOTP(req.body.email,Otp);
               
                    // res.redirect('/loginVerify')
                    res.redirect('/home')
            }else{
                req.session.status=true;
                req.session.Boolean=response.Boolean;
                res.redirect('/login')
                
            }
        }).catch((err)=>{
            console.log(err);
        })
    
    },
    // getLoginVerify:(req,res)=>{
    //     res.render('login-verify',{result:req.session.loginEmail})
    // },
    // postLoginVerify:(req,res)=>{
    //     if( req.session.loginOTP==req.body.Otp){
    //         res.redirect('/home')
    //     }else{
    //         res.redirect('/loginVerify')
    //     }
    // },
    getForgotPassword:(req,res)=>{
        res.render('forgotPassword')
    },
    postForgotPassword:(req,res)=>{
        console.log(req.body);
        let Otp=Math.floor(Math.random()*1000000)
        req.session.forgotPassOTP=Otp;
        req.session.forgotPassEmail=req.body.email;
        helper.sentOTP(req.body.email,Otp);
        res.redirect('/verifyPassword')

    },
    getVerifyPassword:(req,res)=>{
        res.render('verifyPassword')
    },

    postVerifyPassword:(req,res)=>{
        if( req.session.forgotPassOTP==req.body.otp){
            res.redirect('/passwordSetting')
        }else{
            res.send("invalid OTP")
        }
    },
    getpasswordSetting:(req,res)=>{
        res.render('passwordSetting')
    },
    postPasswordSetting:(req,res)=>{
        console.log(req.body);
        if(req.body.newpassword==req.body.confirmPassword){
            console.log(req.session.forgotPassEmail);
            console.log(req.body.confirmPassword);
            user.passwordUpdate(req.session.forgotPassEmail,req.body).then((result) => {
                console.log(result);
                res.redirect('/home')
            }).catch((err) => {
                console.log(err);
                
            });
        }else{
            res.send("error")
        }

    },

       // user-signup-page
    getSignup:(req,res)=>{
        if( req.session.userexcist==true||req.session.ban==true ){
            res.render('userSignup',{title:"User already exists"})
            req.session.userexcist=false
            req.session.ban=false
        }
        else{
            res.render('userSignup')
        }
    },
    postSignup:(req,res)=>{
      
        req.session.userData=req.body;
        req.session.username=req.body.fname;


        user.checkSignup(req.body).then((resp)=>{
            console.log(resp);
            if(resp.status==false && resp.Boolean==false){
                let otp=Math.floor(Math.random()*1000000)
                req.session.signupOTP=otp
                req.session.signupEmail=req.body.email
              helper.sentOTP(req.body.email,otp)
              req.session.userStatus=true;
               res.redirect('/signupVerify')
            }else{
                req.session.userexcist=resp.status
                req.session.ban=resp.Boolean
              res.redirect('/signup')
            }
    
        })
        
    }, 
    getSignupVerify:(req,res)=>{
        
        res.render('signupVerify',{result:req.session.signupEmail,status:req.session.OTPstatus})
        req.session.OTPstatus=false;
    },
    postSignupVerify:(req,res)=>{

        console.log(req.body);
        if(req.session.signupOTP==req.body.Otp){
            user.userSignup(req.session.userData).then((data)=>{
                res.redirect('/home')
            })
            
        }else{
            req.session.OTPstatus=true;
            res.redirect('/signupVerify')
        }

    },
    getShopPage:(req,res)=>{
        user.getProduct().then((result) => {
            user.listCategory().then((catg)=>{
                user.listBrand().then((brand)=>{
                    if(req.session.catgStatus){
                        res.render('shop-page',{result:req.session.catgData,catg,brand})  
    
                    }else if(req.session.sortStatus){
                        res.render('shop-page',{result:req.session.sortData,catg,brand})  
                    }else if( req.session.brandStatus){
                        res.render('shop-page',{result:req.session.brandData,catg,brand}) 
                    }
                    else{
                        res.render('shop-page',{result,catg,brand})
                    }
                    req.session.catgStatus=false
                    req.session.sortStatus=false
                    req.session.brandStatus=false
                })
                
            })
            
        }).catch((err) => {
            console.log(err);
        });
       
    },
    getCategoryList:(req,res)=>{
        user.getCategoryProducts(req.params.name).then((result) => {
            req.session.catgStatus=true;
            req.session.catgData=result;
            res.redirect('/shop-page')     
        }).catch((err) => {
            console.log(err);
        });

    },
    getSortProduct:(req,res)=>{
        user.sortProduct(req.params.sort).then((result) => {
            req.session.sortStatus=true;
            req.session.sortData=result;
            res.redirect('/shop-page')  
        }).catch((err) => {
            console.log(err);
        });
    },
    getSearchProduct:(req,res)=>{
        user.searchProduct(req.query).then((result) => {
            res.render('shop-page',{result})
        }).catch((err) => {
            console.log(err);
        });

    },
    getBrandList:(req,res)=>{
        user.brandDetails(req.params.name).then((brand) => {
            req.session.brandStatus=true;
            req.session.brandData=brand;
            res.redirect('/shop-page')  
        }).catch((err) => {
            
        });
    },
    getProductDetails:(req,res)=>{
        user.productDetails(req.params.id).then((result) => {
            res.render('productDetails',{result})
        }).catch((err) => {
            console.log(err);
        });
        
    },

    //Add to cart
    getAddCart:(req,res)=>{
        console.log(req.session.userID);
        console.log(req.params.id);
        user.productAddCart(req.session.userID,req.params.id).then((result)=>{
            console.log(result);
            res.send("added")
        })
       

    },
    getCart:(req,res)=>{
        user.cartProducts(req.session.userID).then((result)=>{
          user.viewCart(result).then((result)=>{
            res.render('cart',{result})
          })
        })
       
    },
    getDeleteCart:(req,res)=>{
        console.log(req.params.id);
        user.deleteCartProduct(req.session.userID,req.params.id).then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });

        res.send("deleted")
    }
   
}