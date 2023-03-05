const { response } = require('express')
const express =require('express')
const helper=require('../helpers/sentOTP')
const { use } = require('../routes/admins')
const user = require('../Services/user')
const successMail=require('../helpers/successMail')
      

module.exports={
    // Home-page

    getHome:(req,res)=>{
        req.session.catgStatus=false
        req.session.sortStatus=false
        req.session.searchStatus=false
        if(req.session.userID){
            user.bannerDetails().then((banner)=>{
                let mac=banner.find(e=>e.bannerName=="mac")
                let iphone=banner.find(e=>e.bannerName=="iphone")
                let realme=banner.find(e=>e.bannerName=="realme")
                
                let userstatus= req.session.userStatus;
            let username=req.session.username;
            if( req.session.homeSearchStatus){
                res.render('homepage',{userstatus,username,result:req.session.homeSearch,status: req.session.homeSearchStatus,mac,iphone,realme})
               
            }else{
                res.render('homepage',{userstatus,username,banner,mac,iphone,realme})
            }
            req.session.homeSearchStatus=false;
            }).catch(err=>{
                console.log(err);
                res.status(500).send('An error occurred');
            })
            // res.redirect('/home')
            
        }else{
            user.bannerDetails().then((banner)=>{
                let mac=banner.find(e=>e.bannerName=="mac")
                let iphone=banner.find(e=>e.bannerName=="iphone")
                let realme=banner.find(e=>e.bannerName=="realme")
                if( req.session.homeSearchStatus){
                    res.render('homepage',{result:req.session.homeSearch,status: req.session.homeSearchStatus,mac,iphone,realme})
                }else{
                    res.render('homepage',{mac,iphone,realme})
                }
                req.session.homeSearchStatus=false;
                    // req.session.userStatus=false;
            }).catch(err=>{
                console.log(err);
                res.status(500).send('An error occurred');
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
        }).catch(err=>{
            console.log(err);
            res.status(500).send('An error occurred');
        })
    
    },
    getLoginVerify:(req,res)=>{
        try {
            res.render('login-verify',{result:req.session.loginEmail})
        } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred');
        }
      
    },
    postLoginVerify:(req,res)=>{
        try {
            if( req.session.loginOTP==req.body.Otp){
                res.redirect('/home')
            }else{
                res.redirect('/loginVerify')
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred');
        }
        
    },
    getForgotPassword:(req,res)=>{
        try {
            res.render('forgotPassword')  
        } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred');
        }
        
    },
    postForgotPassword:(req,res)=>{
        try {
            let Otp=Math.floor(Math.random()*1000000)
            req.session.forgotPassOTP=Otp;
            req.session.forgotPassEmail=req.body.email;
            helper.sentOTP(req.body.email,Otp);
            res.redirect('/verifyPassword')
        } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred');
        }
        
     

    },
    getVerifyPassword:(req,res)=>{
        try {
            res.render('verifyPassword',{result: req.session.forgotPassEmail,status:req.session.OTPstat})
        } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred');
        }
        
    },

    postVerifyPassword:(req,res)=>{
        try {
            if( req.session.forgotPassOTP==req.body.otp){
                res.redirect('/passwordSetting')
            }else{
                req.session.OTPstat=true;
                res.redirect('/verifyPassword')
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred');
        }
        
    },
    getpasswordSetting:(req,res)=>{
        try {
            res.render('passwordSetting')
        } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred');
        }
       
    },
    postPasswordSetting:(req,res)=>{
    
        if(req.body.newpassword==req.body.confirmPassword){
            user.passwordUpdate(req.session.forgotPassEmail,req.body).then((result) => {
                console.log(result);
                res.redirect('/login')
            }).catch((err) => {
                console.log(err);
                res.status(500).send('An error occurred');
            });
        }else{
            res.redirect('back')
        }

    },

       // user-signup-page
    getSignup:(req,res)=>{
        try {
            if( req.session.userexcist==true||req.session.ban==true ){
                res.render('userSignup',{title:"User already exists"})
                req.session.userexcist=false
                req.session.ban=false
            }
            else{
                res.render('userSignup')
            } 
        } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred');
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
    
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
        
    }, 
    getResendOtp:(req,res)=>{
     try {
           let otp=Math.floor(Math.random()*1000000)
            req.session.signupOTP=otp
            helper.sentOTP(req.session.signupEmail,otp)
            req.session.userStatus=true;
            res.redirect('/signupVerify')
     } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred');
     }
        
 

    },
    getResendOTP:(req,res)=>{
       try {
        let otp=Math.floor(Math.random()*1000000)
        req.session.loginOTP=otp;
        req.session.loginEmail;
        helper.sentOTP(req.session.loginEmail,otp)
        req.session.userStatus=true;
        res.redirect('/loginVerify')
       } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred');
       }

    },
    getResendOTp:(req,res)=>{
        try {
            let otp=Math.floor(Math.random()*1000000)
            req.session.forgotPassOTP=otp
            helper.sentOTP( req.session.forgotPassEmail,otp)
            req.session.userStat=true;
            res.redirect('/verifyPassword')
        } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred');
        }
       
    },

    getSignupVerify:(req,res)=>{
        try {
            res.render('otpVerify',{result:req.session.signupEmail,status:req.session.OTPstatus})
            req.session.OTPstatus=false;  
        } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred');
        }
       
    },
    postSignupVerify:(req,res)=>{
 
        if(req.session.signupOTP==req.body.Otp){
            user.userSignup(req.session.userData).then((data)=>{
                res.redirect('/login')
            }).catch((err=>{
                console.log(err);
                res.status(500).send('An error occurred');
            }))
            
        }else{
            req.session.OTPstatus=true;
            res.redirect('/signupVerify')
        }

    },
    getShopPage:(req,res)=>{
        try {       
             
             if(req.session.user){
                user.wishlistProducts(req.session.userID).then((result) => {
                    req.session.wlProduct=result;
                   
                 }) 
             }
               
        let count=req.session.cartCount;
        req.session.pageNum=parseInt(req.query.page??1) 
        req.session.perpage=4;
    
        user.getProduct(req.session.pageNum,req.session.perpage).then((result) => {
            let data=result.result
            if(req.session.user){
            let data=result.result
            for(let i=0;i<req.session.wlProduct.length ?? 0;i++){
                for(let j=0;j<data.length??0;j++){
                    if(data[j]._id==req.session.wlProduct[i]){
                        data.map((item, index)=>{
                            data[j].wishlist=true;
                            })
                    }
                    
                }
               
            }
        }
            req.session.data=data;
     
            user.listCategory().then((catg)=>{
                 
                    if(req.session.catgStatus){
                        try {
                            user.getCategoryProducts(req.session.categoryName,req.session.pageNum,req.session.perpage).then((result) => {
                                let data=result.result
                                if(req.session.user){
                                for(let i=0;i<req.session.wlProduct.length??0;i++){
                                    for(let j=0;j<data.length??0;j++){
                                        if(data[j]._id==req.session.wlProduct[i]){
                                            data.map((item, index)=>{
                                                data[j].wishlist=true;
                                                })
                                        }
                                        
                                    }
                                   
                                }}
                                let pageCount=Math.ceil(result.docCount/req.session.perpage)
                                let pagination=[]
                                for(i=1;i<=pageCount;i++){
                                    pagination.push(i)
                                }
                                res.render('shop-page',{result:data,catg,count,session:req.session.userID,pagination})  
            
                            })
                        } catch (error) {
                            console.log(error);
                        }
                        
                       
                    }else if(req.session.sortStatus){
                        if(req.session.searchStatus){
                         
                            user.sortProduct(req.session.sortData,req.session.categoryName,req.session.searchQuery,req.session.pageNum,req.session.perpage).then((result) => {
                                let data=result.result
                                if(req.session.user){
                                for(let i=0;i<req.session.wlProduct.length??0;i++){
                                    for(let j=0;j<data.length??0;j++){
                                        if(data[j]._id==req.session.wlProduct[i]){
                                            data.map((item, index)=>{
                                                data[j].wishlist=true;
                                                })
                                        }
                                        
                                    }
                                   
                                }}
                                let pageCount=Math.ceil(result.docCount/req.session.perpage)
                                let pagination=[]
                                for(i=1;i<=pageCount;i++){
                                    pagination.push(i)
                                }
                                res.render('shop-page',{result:data,catg,count,session:req.session.userID,pagination})  
                            })
                        }else{
                           
                            req.session.searchQuery="null";
                            user.sortProduct(req.session.sortData,req.session.categoryName,req.session.searchQuery,req.session.pageNum,req.session.perpage).then((result) => {
                                let data=result.result
                                if(req.session.user){
                                for(let i=0;i<req.session.wlProduct.length??0;i++){
                                    for(let j=0;j<data.length??0;j++){
                                        if(data[j]._id==req.session.wlProduct[i]){
                                            data.map((item, index)=>{
                                                data[j].wishlist=true;
                                                })
                                        }
                                        
                                    }
                                   
                                }}
                                let pageCount=Math.ceil(result.docCount/req.session.perpage)
                                let pagination=[]
                                for(i=1;i<=pageCount;i++){
                                    pagination.push(i)
                                }
                                res.render('shop-page',{result:data,catg,count,session:req.session.userID,pagination})  
                            })
                        }
                       
                    }else if(req.session.searchStatus){
                        let data=req.session.search.result;
                        if(req.session.user){
                        for(let i=0;i<req.session.wlProduct.length??0;i++){
                            for(let j=0;j<data.length??0;j++){
                                if(data[j]._id==req.session.wlProduct[i]){
                                    data.map((item, index)=>{
                                        data[j].wishlist=true;
                                        })
                                }
                                
                            }
                              
                        }}
                        let pageCount=Math.ceil(req.session.search.docCount/req.session.perpage)
                                let pagination=[]
                                for(i=1;i<=pageCount;i++){
                                    pagination.push(i)
                                }
                        res.render('shop-page',{result:data,catg,count,session:req.session.userID,pagination}) 
                    }
                    else{
                        
                        let pageCount=Math.ceil(result.docCount/req.session.perpage)
                        let pagination=[]
                        for(i=1;i<=pageCount;i++){
                            pagination.push(i)
                        }
                        res.render('shop-page',{result:req.session.data,catg,count,session:req.session.userID,pagination})
                    }
                    
                  
                   
                    
                
                
            }).catch((err) => {
                console.log(err);
                res.status(500).send('An error occurred');
            });
            
           }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
           });
       
           } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred');
          }
    },
    getCategoryList:(req,res)=>{
        req.session.categoryName=req.params.name;                                                                                    
            req.session.searchStatus=false;
            req.session.catgStatus=true;
            req.session.sortStatus=false  
            res.redirect('/shop-page')     
             
        

    },
    getSortProduct:(req,res)=>{
        
            req.session.sortStatus=true;
            req.session.catgStatus=false
            req.session.sortData=req.params.sort;
            res.redirect('/shop-page')  
         
    },
    getSearchProduct:(req,res)=>{
         
        req.session.sortStatus=false
        req.session.catgStatus=false
        req.session.searchQuery=req.query
        user.searchProduct(req.query,req.session.pageNum,req.session.perpage).then((result) => {
           
            if(result.result.length==0){
                res.render('searchErrorPage')
            }else{
            req.session.searchStatus=true;
            req.session.search=result;
            res.redirect('/shop-page')
            }  
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });

    },
    getProductDetails:(req,res)=>{
        user.productDetails(req.params.id).then((result) => {
            res.render('productDetails',{result})
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
        
    },
  

    //Add to cart
    getAddCart:(req,res)=>{
        
        try{
            
             user.productAddCart(req.session.userID,req.params.id).then((result)=>{
               user.cartProducts(req.session.userID).then((result)=>{
                 let count=result.length;
                 res.json({success:true,count})
               })
                
             }).catch((err) => {
                console.log(err);
                res.status(500).send('An error occurred');
            });

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
                     }).catch((err) => {
                        console.log(err);
                        res.status(500).send('An error occurred');
                    });
                   }).catch((err) => {
                    console.log(err);
                    res.status(500).send('An error occurred');
                });
                 }).catch((err) => {
                    console.log(err);
                    res.status(500).send('An error occurred');
                });
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });

        

    },

  
    getQtyDec:(req,res)=>{
        
        user.checkQty(req.session.userID,req.params.id).then((result)=>{
            
            cItem=result;
            let cartItems=cItem.map(item=>{
              return item.quantity
            })
           
            if(cartItems[0]<=1){
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
                        // console.log(result);
                      const totalP = result.reduce((acc, item) => {
                          return acc += item.price*item.cartQuantity;
                      }, 0);
                      let calc=totalP
                
                   
                      let cartQty=req.session.totalP;
                      
                    
                      res.json({success:true,cartQty,calc})
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).send('An error occurred');
                    });
                }).catch((err) => {
                    console.log(err);
                    res.status(500).send('An error occurred');
                });
                   
                
                     
                 
                 }).catch((err) => {
                    console.log(err);
                    res.status(500).send('An error occurred');
                });
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });

      

    },
    getCart:(req,res)=>{
        req.session.catgStatus=false
        req.session.sortStatus=false
        req.session.searchStatus=false
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
          }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
       
    },
    getDeleteCart:(req,res)=>{
       
        user.deleteCartProduct(req.session.userID,req.params.id).then(() => {
           
            res.redirect('/cart')
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
    },
    
    // Wishlist

    getAddWishlist:(req,res)=>{
       
        user.productAddWishlist(req.session.userID,req.params.id).then(() => {
           
            res.redirect('back')
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
    },
   

    getWishlist:(req,res)=>{
        req.session.catgStatus=false
        req.session.sortStatus=false
        req.session.searchStatus=false
        user.wishlistProducts(req.session.userID).then((result) => {
            user.viewWishlist(result).then((result) => {
                req.session.wlCount=result.length;
                let count= (req.session.wlCount==0)?true:false;
                res.render('wishlist',{result,count,wlCount: req.session.wlCount})
            }).catch((err) => {
                console.log(err);
                res.status(500).send('An error occurred');
            });
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });

    },
    getAddCartDeleteWl:(req,res)=>{
        user.productAddCart(req.session.userID,req.params.id).then(()=>{
            user.deleteWishlistProduct(req.session.userID,req.params.id).then(()=>{
                res.redirect('back')
            }).catch((err) => {
                console.log(err);
                res.status(500).send('An error occurred');
            });
            
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
       
    },


    getDeleteWishlist:(req,res)=>{
        user.deleteWishlistProduct(req.session.userID,req.params.id).then(() => {
            res.redirect('back')
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
    },
    getCheckout:(req,res)=>{
        req.session.userProfileStatus=false;
        user.userDetails(req.session.userID).then((result)=>{
           req.session.walletBal=result.wallet;
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
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
                  if(req.session.couponStatus ==true && totalPrice>req.session.minPurchaseAmt){
                      totalPrice=totalPrice-req.session.discountAmt;
                     
                      res.render('checkout',{result:req.session.selectedAddress,
                        status:req.session.addressStatus,
                        totalPrice,discount:req.session.discountAmt,
                        products,couponStat:req.session.couponStatus,wallet })
                  }else{
                      res.render('checkout',{result:req.session.selectedAddress,
                        status:req.session.addressStatus
                        ,totalPrice,discount:'00',products,
                        validCoupon: req.session.validCoupon,
                        invalidCoupon: req.session.invalidCoupon,wallet}) 
                  }
                  req.session.validCoupon=false;
                  req.session.invalidCoupon=false;
                  req.session.couponStatus=false
                }else{
                  
                    req.session.productResult=result
                    req.session.productStock=true;
                    res.redirect('/cart')
                    
                }
             


          }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
       
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
                res.status(500).send('An error occurred');
            });
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
        
    },
    getCheckoutAddress:(req,res)=>{
        req.session.checkoutAddress=true;
        user.getAddress(req.session.userID).then((result) => {
            res.render('checkoutAddress',{result})
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
    },

    getUserProfile:(req,res)=>{
        req.session.checkoutAddress=false;
        user.getAddress(req.session.userID).then((result) => {
            req.session.getAddress=result
            req.session.userProfileStatus=true;
            user.userDetails(req.session.userID).then((data)=>{
                res.render('userProfile',{result: req.session.getAddress,data})
            })
           
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
    },
    getSelectedAddress:(req,res)=>{
        user.selectedAddress(req.session.userID,req.params.id).then((result)=>{
            req.session.selectedAddress=result;
            req.session.addressStatus=true;
            res.redirect('/checkout')
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
    },
    getDeletedAddress:(req,res)=>{
        user.deletedAddress(req.session.userID,req.params.id).then((result)=>{
            req.session.selectedAddress=result;
            res.redirect('back')
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
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
        

          
        }).catch((err) => {
            console.log(err);
            res.status(500).send('An error occurred');
        });
    },
    postCheckoutOrder:(req,res)=>{
        try {
            req.session.order=req.body;
        if(req.body.payment=='COD'){
            if(req.body.wallet=='walletapplied'){
                console.log("wallet applied");
                user.userDetails(req.session.userID).then((result)=>{
                    req.session.wallet=result.wallet;
                    let wallet=result.wallet;
                    let totalPrice=parseInt(req.body.totalPrice)
                    if(wallet>=totalPrice){
                        req.session.amount=0;
                    }else{
                        req.session.amount=totalPrice-wallet;
                    }
                    user.orderCheckout(req.body,req.session.amount,req.session.orderProduct, req.session.selectedAddress,req.session.userID,wallet).then((result)=>{
                        res.json({codSuccess:true})
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).send('An error occurred');
                    });
                })
            }else{
                console.log("wallet not applied");
                req.session.amount=req.session.order.totalPrice;
                user.orderCheckout(req.body,req.session.amount,req.session.orderProduct, req.session.selectedAddress,req.session.userID,req.session.wallet).then((result)=>{
                    res.json({codSuccess:true})
                })
            }
           
        }else if(req.body.payment=='online'){
            if(req.body.wallet=='walletapplied'){
                user.userDetails(req.session.userID).then((result)=>{
                    let wallet=result.wallet;
                    let totalPrice=parseInt(req.body.totalPrice)
                    if(wallet>=totalPrice){
                        req.session.amount=0;
                        user.orderCheckout(req.body,req.session.amount,req.session.orderProduct, req.session.selectedAddress,req.session.userID,wallet).then((result)=>{
                            res.json({codSuccess:true})
                        })
                    }else{
                        let amount=totalPrice-wallet;
                        let name=req.session.selectedAddress.fname;
                        let phone=req.session.selectedAddress.phone;
                        let email=req.session.user;
                        let orderId=Math.floor(Math.random()*1000000)+ Date.now() 
                        user.generateRazorpay(orderId,amount).then((result)=>{
                            res.json({onlineSuccess:true,result,name,phone,email})
                            })
                    }
                  
                    
                })   
            }else{
                req.session.amount=req.session.order.totalPrice;
                let name=req.session.selectedAddress.fname;
                let phone=req.session.selectedAddress.phone;
                let email=req.session.user;
                let orderId=Math.floor(Math.random()*1000000)+ Date.now() 
                user.generateRazorpay(orderId, req.session.amount).then((result)=>{
                    res.json({onlineSuccess:true,result,name,phone,email})
                    })
                
            }
            
        }else{
           res.json({err:true})
        }
        } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred');
        }
        
    },
    getVerifyPayment:(req,res)=>{
        user.verifyPayment(req.body).then(()=>{
            user.orderCheckout(req.session.order,req.session.amount,req.session.orderProduct, req.session.selectedAddress,req.session.userID,req.session.wallet).then((result)=>{
                res.json({success:true})
            })
        }).catch(err=>{
            console.log(err);
            res.status(500).send('An error occurred');
        })
    },
    getOrderSuccess:(req,res)=>{
        try {
            res.render('orderSuccess',{email:req.session.user})
            //successMail.successMail(req.session.user,req.session.username)
        } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred');
        }
      
    }, 
    

    getEditUser:(req,res)=>{
        user.editUserDetails(req.session.userID).then((result)=>{
            res.render('editUser',{result})
        }).catch(err=>{
            console.log(err);
            res.status(500).send('An error occurred');
        })
      
    },
    postupdateUser:(req,res)=>{
       
        user.updateUserDetails(req.session.userID,req.body).then((result)=>{
            res.redirect('/userProfile')
        }).catch(err=>{
            console.log(err);
            res.status(500).send('An error occurred');
        })
    },
    getEditAddressDetails:(req,res)=>{
        user.selectedAddress(req.session.userID,req.params.id).then((result)=>{
            res.render('editAddress',{result})
        }).catch(err=>{
            console.log(err);
            res.status(500).send('An error occurred');
        })
       
    },
    postUpdateAddress:(req,res)=>{
        user.updateAddress(req.session.userID,req.params.id,req.body).then((result)=>{
            if(req.session.checkoutAddress){
                res.redirect('/editAddress')
               
            }else{
                res.redirect('/userProfile')
            }
           
        }).catch(err=>{
            console.log(err);
            res.status(500).send('An error occurred');
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
           
        }).catch(err=>{
            console.log(err);
            res.status(500).send('An error occurred');
        })
       
    },
    getOrderedProduct:(req,res)=>{
      
    user.getOrderDetails(req.params.id).then((result)=>{
         let date=result.orderDate.toDateString();
        res.render('orderedProduct',{result,date,status:req.session.returnStatus})
        req.session.returnStatus=false;
    }).catch(err=>{
        console.log(err);
        res.status(500).send('An error occurred');
    })
       
    },
    getInvoice:(req,res)=>{
        user.invoice(req.params.id).then((result)=>{
            let date=result[0].orderDate.toLocaleDateString();
             
            res.json({result,date})
        }).catch(err=>{
            console.log(err);
            res.status(500).send('An error occurred');
        })
    },
    postCancelOrder:(req,res)=>{
        user.cancelOrder(req.body,req.session.userID).then(()=>{
            // res.redirect('/orderHistory')
            res.json({success:true})
        }).catch(err=>{
            console.log(err);
            res.status(500).send('An error occurred');
        })
    },
    getReturnOrder:(req,res)=>{
        user.returnOrder(req.params.id).then((result)=>{
            if(result.status){
                res.redirect('/orderHistory')
            }else{
                req.session.returnStatus=true;
                res.redirect('back')
            }
            
        }).catch(err=>{
            console.log(err);
            res.status(500).send('An error occurred');
        })
    },
    getOrderList:(req,res)=>{
        user.orderList(req.params.name).then((result)=>{
            req.session.orderListStatus=true;
            req.session.orderList=result;
            res.redirect('back')
        }).catch(err=>{
            console.log(err);
            res.status(500).send('An error occurred');
        })
    },
 

    getLogout:(req,res)=>{
        // req.session.destroy();
        req.session.user=null;
        req.session.userID=null
        res.redirect('/login')
    }
   
   
}