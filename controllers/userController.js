const { response } = require('express')
const express =require('express')
const helper=require('../helpers/sentOTP')
const { use } = require('../routes/admins')
const admin = require('../Services/admin')
const user = require('../Services/user')
const successMail=require('../helpers/successMail')

const router=express.Router()

module.exports={
    // Home-page

    getHome:(req,res)=>{
        if(req.session.userID){
            user.bannerDetails().then((banner)=>{
                let userstatus= req.session.userStatus;
            let username=req.session.username;
            if( req.session.homeSearchStatus){
                res.render('homepage',{userstatus,username,result:req.session.homeSearch,status: req.session.homeSearchStatus,banner})
               
            }else{
                res.render('homepage',{userstatus,username,banner})
            }
            req.session.homeSearchStatus=false;
            })
            // res.redirect('/home')
            
        }else{
            user.bannerDetails().then((banner)=>{
                if( req.session.homeSearchStatus){
                    res.render('homepage',{result:req.session.homeSearch,status: req.session.homeSearchStatus,banner})
                }else{
                    res.render('homepage',{banner})
                }
                req.session.homeSearchStatus=false;
                    // req.session.userStatus=false;
            })
            // let userstatus= req.session.userStatus;
            // let username=req.session.username;
          
        }
       
        
    },

    // user-login-page
    getLogin:(req,res)=>{

        if(req.session.userID){
            res.redirect('/home')
        }else{
            let resultBan=req.session.ban
            let resultInvalid=req.session.status
          
            res.render('userLogin',{resultBan,resultInvalid})
        
            req.session.Boolean=false;
            req.session.status=false;
        }
      
        
    },
 
    postLogin:(req,res)=>{
        
        user.userLogin(req.body).then((response)=>{
            
            if(response.status == true && response.ban==false){ 
            
            req.session.user=response.user.email
            req.session.username=response.user.fname
            req.session.lastName=response.user.lname
            req.session.userID=response.user._id;
            req.session.ban=response.user.ban;
            req.session.userStatus=true;
            
            //    let Otp=Math.floor(Math.random()*1000000)
            //    console.log(Otp);
            //    req.session.loginOTP=Otp;
            //    req.session.loginEmail=req.body.email;
            //    helper.sentOTP(req.body.email,Otp);
            //         res.redirect('/loginVerify')


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
    getLoginVerify:(req,res)=>{
        res.render('login-verify',{result:req.session.loginEmail})
    },
    postLoginVerify:(req,res)=>{
        if( req.session.loginOTP==req.body.Otp){
            res.redirect('/home')
        }else{
            res.redirect('/loginVerify')
        }
    },
    getForgotPassword:(req,res)=>{
        res.render('forgotPassword')
    },
    postForgotPassword:(req,res)=>{
        
        let Otp=Math.floor(Math.random()*1000000)
        req.session.forgotPassOTP=Otp;
        req.session.forgotPassEmail=req.body.email;
        helper.sentOTP(req.body.email,Otp);
        res.redirect('/verifyPassword')

    },
    getVerifyPassword:(req,res)=>{
        res.render('verifyPassword',{result: req.session.forgotPassEmail,status:req.session.OTPstat})
    },

    postVerifyPassword:(req,res)=>{
        if( req.session.forgotPassOTP==req.body.otp){
            res.redirect('/passwordSetting')
        }else{
            req.session.OTPstat=true;
            res.redirect('/verifyPassword')
        }
    },
    getpasswordSetting:(req,res)=>{
        res.render('passwordSetting')
    },
    postPasswordSetting:(req,res)=>{
    
        if(req.body.newpassword==req.body.confirmPassword){
            user.passwordUpdate(req.session.forgotPassEmail,req.body).then((result) => {
                console.log(result);
                res.redirect('/login')
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
            
            if(resp.status==false && resp.ban==false){
                let otp=Math.floor(Math.random()*1000000)
                req.session.signupOTP=otp
               
                req.session.signupEmail=req.body.email
              helper.sentOTP(req.body.email,otp)
              req.session.userStatus=true;
               res.redirect('/signupVerify')
            }else{
                
                req.session.userexcist=resp.status
                req.session.ban=resp.ban
              res.redirect('/signup')
            }
    
        })
        
    }, 
    getResendOtp:(req,res)=>{
     
        let otp=Math.floor(Math.random()*1000000)
            req.session.signupOTP=otp
            helper.sentOTP(req.session.signupEmail,otp)
            req.session.userStatus=true;
               res.redirect('/signupVerify')
 

    },
    getResendOTP:(req,res)=>{
        let otp=Math.floor(Math.random()*1000000)
        req.session.loginOTP=otp;
        req.session.loginEmail;
            helper.sentOTP(req.session.loginEmail,otp)
            req.session.userStatus=true;
               res.redirect('/loginVerify')

    },
    getResendOTp:(req,res)=>{
        let otp=Math.floor(Math.random()*1000000)
        req.session.forgotPassOTP=otp
        helper.sentOTP( req.session.forgotPassEmail,otp)
        req.session.userStat=true;
           res.redirect('/verifyPassword')
    },

    getSignupVerify:(req,res)=>{
        
        res.render('otpVerify',{result:req.session.signupEmail,status:req.session.OTPstatus})
        req.session.OTPstatus=false;
    },
    postSignupVerify:(req,res)=>{

       
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
        let count=req.session.cartCount;
        user.getProduct().then((result) => {
            user.listCategory().then((catg)=>{
                user.listBrand().then((brand)=>{
                    if(req.session.catgStatus){
                        res.render('shop-page',{result:req.session.catgData,catg,brand,count,session:req.session.userID})  
    
                    }else if(req.session.sortStatus){
                        res.render('shop-page',{result:req.session.sortData,catg,brand,count,session:req.session.userID})  
                    }else if( req.session.brandStatus){
                        res.render('shop-page',{result:req.session.brandData,catg,brand,count,session:req.session.userID}) 
                    }else if(req.session.searchStatus){
                        res.render('shop-page',{result:req.session.searchData,catg,brand,count,session:req.session.userID}) 
                    }
                    else{
                        res.render('shop-page',{result,catg,brand,count,session:req.session.userID})
                    }
                    req.session.catgStatus=false
                    req.session.sortStatus=false
                    req.session.brandStatus=false
                    req.session.searchStatus=false;
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
            res.redirect('back')     
        }).catch((err) => {
            console.log(err);
        });

    },
    getSortProduct:(req,res)=>{
        user.sortProduct(req.params.sort).then((result) => {
            req.session.sortStatus=true;
            req.session.sortData=result;
            res.redirect('back')  
        }).catch((err) => {
            console.log(err);
        });
    },
    getSearchProduct:(req,res)=>{
        console.log(req.query);
        user.searchProduct(req.query).then((result) => {
            if(result.length==0){
                res.render('searchErrorPage')
            }else{
            req.session.searchStatus=true;
           
            req.session.searchData=result;
            res.redirect('/shop-page')
            }  
        }).catch((err) => {
            console.log(err);
        });

    },
    getBrandList:(req,res)=>{
        user.brandDetails(req.params.name).then((brand) => {
            req.session.brandStatus=true;
            req.session.brandData=brand;
            res.redirect('back')  
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
    getSearchPdt:(req,res)=>{
        user.searchProduct(req.query).then((result) => {
            if(result.length==0){
                res.render('searchErrorPage')
            }else{
                req.session.homeSearch=result;
                req.session.homeSearchStatus=true;
                console.log(result);
                // res.render('searchPage',{result})
                res.redirect('/home')
            }
           

        }).catch((err) => {
            console.log(err);
        });

    },

    //Add to cart
    getAddCart:(req,res)=>{
        
        try{
            
             user.productAddCart(req.session.userID,req.params.id).then((result)=>{
               user.cartProducts(req.session.userID).then((result)=>{
                 let count=result.length;
                 // res.redirect('back')
                 res.json({success:true,count})
               })
                
             })

        }catch(err){
            res.status(501).json({err})
        }
       

    },
    getQtyInc:(req,res)=>{
        let productId=req.params.id;
        user.checkQty(req.session.userID,req.params.id).then((result)=>{
            cItem=result;
           
            let cartItems=cItem.map(item=>{
              return item.quantity
            })
          
            if(cartItems[0]>9){
                res.redirect('back')
            }else{
                user.quantityInc(req.session.userID,req.params.id).then((result)=>{
                    
                    
                    req.session.total=result
                    user.cartProducts(req.session.userID).then((result)=>{
                       cItem=result;
                       let cartQuantities={}
                       cItem.map(item=>{
                         cartQuantities[item.productId]=item.quantity
                       return item.quantity
                       })
          
         
                   user.viewCart(result).then((result)=>{
                       req.session.cartCountNr=result.length;
                       result.map((item, index)=>{
                       result[index].cartQuantity=cartQuantities[item._id];
                       })
                       req.session.cartCount=result.length;
         
                     const totalP = result.reduce((acc, item) => {
                         return acc += item.price*item.cartQuantity;
                     }, 0);
                     let calc=totalP
                  
                  
                     let cartQty=req.session.total;
                    
                     res.json({success:true,cartQty,calc})
                   })
               })
                 })
            }
        })

        

    },

  
    getQtyDec:(req,res)=>{
        
        user.checkQty(req.session.userID,req.params.id).then((result)=>{
            cItem=result;
            let cartItems=cItem.map(item=>{
              return item.quantity
            })
            
            if(cartItems[0]<2){
                res.redirect('back')
            }else{
                user.quantityDec(req.session.userID,req.params.id).then((result)=>{
                    req.session.totalP=result
                     user.cartProducts(req.session.userID).then((result)=>{
                        cItem=result;
                        let cartQuantities={}
                        cItem.map(item=>{
                          cartQuantities[item.productId]=item.quantity
                        return item.quantity
                        })
           
          
                    user.viewCart(result).then((result)=>{
                        req.session.cartCountNr=result.length;
                        result.map((item, index)=>{
                        result[index].cartQuantity=cartQuantities[item._id];
                        })
                        req.session.cartCount=result.length;
          
                      const totalP = result.reduce((acc, item) => {
                          return acc += item.price*item.cartQuantity;
                      }, 0);
                      let calc=totalP
                
                   
                      let cartQty=req.session.totalP;
                    
                      res.json({success:true,cartQty,calc})
                    })
                })
                   
                
                     
                 
                 })
            }
        })

      

    },
    getCart:(req,res)=>{
         
          user.cartProducts(req.session.userID).then((result)=>{
              cItem=result;
              let cartQuantities={}
              cItem.map(item=>{
                cartQuantities[item.productId]=item.quantity
              return item.quantity
              })
 

          user.viewCart(result).then((result)=>{
              req.session.cartCountNr=result.length;
              result.map((item, index)=>{
              result[index].cartQuantity=cartQuantities[item._id];
              })
              req.session.cartCount=result.length;

            const calcAmount = result.reduce((acc, item) => {
                return acc += item.price*item.cartQuantity;
            }, 0);
            const totalPrice=calcAmount;
             
            
           
           let count= (req.session.cartCountNr==0)?true:false;
           if( req.session.productStock){
            res.render('cart',{result: req.session.productResult,totalPrice,count,cartCount: req.session.cartCount,stockStatus: req.session.productStock})
           }else{
            res.render('cart',{result,totalPrice,count,cartCount: req.session.cartCount })
           }
          
           
            req.session.productStock=false;
          })
        })
       
    },
    getDeleteCart:(req,res)=>{
       
        user.deleteCartProduct(req.session.userID,req.params.id).then(() => {
           
            res.redirect('/cart')
        }).catch((err) => {
            console.log(err);
        });
    },
    
    // Wishlist

    getAddWishlist:(req,res)=>{
       
        user.productAddWishlist(req.session.userID,req.params.id).then(() => {
           
            res.redirect('back')
        }).catch((err) => {
           console.log(err); 
        });
    },
   

    getWishlist:(req,res)=>{
        user.wishlistProducts(req.session.userID).then((result) => {
            user.viewWishlist(result).then((result) => {
                req.session.wlCount=result.length;
                let count= (req.session.wlCount==0)?true:false;
                res.render('wishlist',{result,count,wlCount: req.session.wlCount})
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });

    },
    getAddCartDeleteWl:(req,res)=>{
        user.productAddCart(req.session.userID,req.params.id).then(()=>{
            user.deleteWishlistProduct(req.session.userID,req.params.id).then(()=>{
                res.redirect('back')
            }).catch(err=>{
                console.log(err);
            })
            
        })
       
    },


    getDeleteWishlist:(req,res)=>{
        // console.log(req.session.userID);
        console.log("hello");
        user.deleteWishlistProduct(req.session.userID,req.params.id).then(() => {
            res.redirect('back')
            // res.json({success:true})
        }).catch((err) => {
            console.log(err);
        });
    },
    // getCheckout:(req,res)=>{
    //     console.log(req.params.id);
    //    res.render('checkout',{result:req.session.selectedAddress,status:req.session.addressStatus})
       

    // },
    getCheckout:(req,res)=>{
        req.session.userProfileStatus=false;
        user.userDetails(req.session.userID).then((result)=>{
           req.session.walletBal=result.wallet;
        })
        user.cartProducts(req.session.userID).then((result)=>{
            cItem=result;
            let cartQuantities={}
            cItem.map(item=>{
              cartQuantities[item.productId]=item.quantity
            return item.quantity
            })
          user.viewCart(result).then((result)=>{
            result.map((item, index)=>{
                result[index].cartQuantity=cartQuantities[item._id];
                })



                for(i=0;i<result.length;i++){

                    if(result[i].cartQuantity>result[i].quandity){
                        result.map((item, index)=>{
                            result[i].pdtStatus=true;
                            })                                
                    }else{
                        result.map((item, index)=>{
                            result[i].pdtStatus=false;
                            }) 
                    }
                    result.map((item, index)=>{
                        result[i].subTotal=result[i].cartQuantity*result[i].price;
                        }) 
                } 
              
                for(i=0;i<result.length;i++){
                    if(result[i].cartQuantity>result[i].quandity){
                                                      
                       req.session.stockStatus=false;
                       break;
                    }else{
                        
                        req.session.stockStatus=true;
                    }
                }              
                if(req.session.stockStatus){
                     
                    req.session.cartCount=result.length;
  
                    const calcAmount = result.reduce((acc, item) => {
                        return acc += item.price*item.cartQuantity;
                    }, 0);
                

                    let totalPrice=calcAmount;
                    let wallet= req.session.walletBal;
                    let products=result;
                    req.session.orderProduct=result; 
                    console.log(req.session.orderProduct);
                    
                  if(req.session.couponStatus ==true && totalPrice>req.session.minPurchaseAmt){
                      totalPrice=totalPrice-req.session.discountAmt;
                     
                      res.render('checkout',{result:req.session.selectedAddress,status:req.session.addressStatus,totalPrice,discount:req.session.discountAmt,products,couponStat:req.session.couponStatus,wallet })
                  }else{
                      res.render('checkout',{result:req.session.selectedAddress,status:req.session.addressStatus,totalPrice,discount:'00',products,validCoupon: req.session.validCoupon,invalidCoupon: req.session.invalidCoupon,wallet}) 
                  }
                  req.session.validCoupon=false;
                  req.session.invalidCoupon=false;
                  req.session.couponStatus=false
                }else{
                  
                    req.session.productResult=result
                    req.session.productStock=true;
                    res.redirect('/cart')
                    
                }
             


          })
        })
       
    },
    getAddAdress:(req,res)=>{
        res.render('addAddress',{result: req.session.invalidAddress})
        req.session.invalidAddress=false;
    },
    postAddedAddress:(req,res)=>{
        user.verifyAddress(req.session.userID,req.body).then((result)=>{
            if(result){
                req.session.invalidAddress=true;
                res.redirect('/addAddress')
            }else{
                user.addAddress(req.session.userID,req.body).then((result) => {
                if(req.session.userProfileStatus){
                    res.redirect('/userProfile')
                }else{
                    res.redirect('/editAddress')
                }    
            }).catch((err) => {
                console.log(err);       
            });
            }
        })
        
    },
    getCheckoutAddress:(req,res)=>{
        user.getAddress(req.session.userID).then((result) => {
            res.render('checkoutAddress',{result})
        }).catch((err) => {
            console.log(err);
        });
    },

    getUserProfile:(req,res)=>{
        user.getAddress(req.session.userID).then((result) => {
            req.session.getAddress=result
            req.session.userProfileStatus=true;
            user.userDetails(req.session.userID).then((data)=>{
                res.render('userProfile',{result: req.session.getAddress,data})
            })
           
        }).catch((err) => {
            console.log(err);
        });
    },
    getSelectedAddress:(req,res)=>{
        user.selectedAddress(req.session.userID,req.params.id).then((result)=>{
            req.session.selectedAddress=result;
            req.session.addressStatus=true;
            res.redirect('/checkout')
        })
    },
    getDeletedAddress:(req,res)=>{
        user.deletedAddress(req.session.userID,req.params.id).then((result)=>{
            req.session.selectedAddress=result;
            res.redirect('back')
        })
    },

    getRedeemCoupon:(req,res)=>{
         
        user.redeemCoupon(req.body.couponCode).then((result)=>{

            if(result==undefined){
               req.session.invalidCoupon=true;
                res.redirect('/checkout')
            }else{
                if(result.expDate>new Date){
                    req.session.discountAmt=result.discountAmt;
                    req.session.minPurchaseAmt=result.minPurchaseAmt;
                    req.session.couponStatus=true
                    res.redirect('/checkout')
                }else{
                    req.session.discountAmt=result.discountAmt;
                    req.session.minPurchaseAmt=result.minPurchaseAmt;
                    req.session.couponStatus=false
                    req.session.validCoupon=true;
                    res.redirect('/checkout')
                }
            }
        

          
        })
    },
    postCheckoutOrder:(req,res)=>{
       req.session.order=req.body;
        if(req.body.payment=='COD'){
            user.orderCheckout(req.body,req.session.orderProduct, req.session.selectedAddress,req.session.userID).then((result)=>{
                res.json({codSuccess:true})
            })
        }else if(req.body.payment=='wallet'){                                        
            user.userDetails(req.session.userID).then((result)=>{           
                if(req.body.totalPrice<=result.wallet){ 
                    user.orderCheckout(req.body,req.session.orderProduct, req.session.selectedAddress,req.session.userID).then((result)=>{
                        
                        res.json({walletSucces:true})
                    })
                }
                else{
                    res.json({walletSucces:false})
                }
            })
        }else if(req.body.payment=='online'){
            let name=req.session.selectedAddress.fname;
            let phone=req.session.selectedAddress.phone;
            let email=req.session.user;
            let orderId=Math.floor(Math.random()*1000000)+ Date.now() 
            let total=parseInt(req.body.totalPrice)
            user.generateRazorpay(orderId,total).then((result)=>{
                res.json({onlineSuccess:true,result,name,phone,email})
                })
        }
    },
    getVerifyPayment:(req,res)=>{
        user.verifyPayment(req.body).then(()=>{
            user.orderCheckout(req.session.order,req.session.orderProduct, req.session.selectedAddress,req.session.userID).then((result)=>{
                res.json({success:true})
            })
        }).catch(err=>{
            console.log(err);
        })
    },
    getOrderSuccess:(req,res)=>{
        res.render('orderSuccess',{email:req.session.user})
        //successMail.successMail(req.session.user,req.session.username)
    }, 
    

    getEditUser:(req,res)=>{
        user.editUserDetails(req.session.userID).then((result)=>{
            res.render('editUser',{result})
        })
      
    },
    postupdateUser:(req,res)=>{
        console.log(req.body);
        user.updateUserDetails(req.session.userID,req.body).then((result)=>{
            res.redirect('/userProfile')
        })
    },
    getEditAddressDetails:(req,res)=>{
        user.selectedAddress(req.session.userID,req.params.id).then((result)=>{
            res.render('editAddress',{result})
        })
       
    },
    postUpdateAddress:(req,res)=>{
        user.updateAddress(req.session.userID,req.params.id,req.body).then((result)=>{
             
            res.redirect('/userProfile')
        })
    },
    getOrderHistory:(req,res)=>{
        user.orderHistory(req.session.userID).then((result)=>{ 
            req.session.orderCount=result.length;
            let count= (req.session.orderCount==0)?true:false;
             
            if(req.session.orderListStatus){
                res.render('orderHistory',{result:req.session.orderList,count})
            }else{
                res.render('orderHistory',{result,count})
            }
           
        })
       
    },
    getOrderedProduct:(req,res)=>{
      
    user.getOrderDetails(req.params.id).then((result)=>{
      
        res.render('orderedProduct',{result})
    })
       
    },
    postCancelOrder:(req,res)=>{
        user.cancelOrder(req.body,req.session.userID).then(()=>{
            // res.redirect('/orderHistory')
            res.json({success:true})
        })
    },
    getReturnOrder:(req,res)=>{
        user.returnOrder(req.params.id).then(()=>{
            res.redirect('/orderHistory')
        })
    },
    getOrderList:(req,res)=>{
        user.orderList(req.params.name).then((result)=>{
            req.session.orderListStatus=true;
            req.session.orderList=result;
            res.redirect('back')
        })
    },
 

    getLogout:(req,res)=>{
        req.session.destroy();
        // req.session.user=null;
        res.redirect('/login')
    }
   
   
}