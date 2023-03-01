
const bcrypt=require('bcrypt');
const { response } = require('express');
const e = require('express');
const userModel = require('../models/userModel');
const productModel=require('../models/productModel')
const categoryModel=require('../models/categoryModel')
const couponModel=require('../models/couponModel')
const orderModel=require('../models/orderModel')
const bannerModel=require('../models/bannerModel')
const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});
module.exports={
    checkSignup:(userData)=>{
        return new Promise(async(resolve, reject) => {
           
            let resp={}
            let user=await userModel.findOne({email:userData.email})
            
            if(user){
                resp.status=true;
                resp.ban=user.ban;
                resolve(resp)
            }
            else{
                resp.status=false;
                resp.ban=false;
                resolve(resp)
           
            }
        });
    },

    userSignup:(userData)=>{
        return new Promise(async(resolve, reject) => {
                let Email=userData.email;
                 userData.password=await bcrypt.hash(userData.password,10)
               let result=await userModel.create({...userData,ban:false,wishlist:[],cart:[],address:[]})
                  resolve(result)
        }); 
    },

    //User Login

    userLogin:(userData)=>{
        return new Promise(async(resolve, reject) => {
            let response={}
            let user=await userModel.findOne({email:userData.email})
            if(user){
              let status= await bcrypt.compare(userData.password,user.password)
              if(status){
                
               response.status=status;
               response.ban=user.ban;
               response.user=user
               console.log("Login successfull");
               
               resolve(response)
              }else{
                console.log("Login Denied");
                resolve({status:false})
              }
            }else{
                console.log("Login failed");
                resolve({status:false})
            }
        });
    },
    passwordUpdate:(email,userpwd)=>{
        return new Promise(async(resolve, reject) => {
            userpwd.confirmPassword=await bcrypt.hash(userpwd.confirmPassword,10)
           let result=await userModel.updateOne({email},{$set:{password:userpwd.confirmPassword}})
                resolve(result)
        });
        

    },
     //Get product Details
     getProduct:()=>{
        return new Promise(async(resolve, reject) => {
          let result= await productModel.find({productStatus:false}).lean()
          resolve(result)
        });
      },

    //   list category
    listCategory:()=>{
        return new Promise(async(resolve, reject) => {
         let result= await categoryModel.find({categoryStatus:false}).lean()
         resolve(result)
        });
      },

    getCategoryProducts:(categy)=>{
        let val="all"
        if(categy==val){
            return new Promise(async(resolve, reject) => {
                let result= await productModel.find().lean()
                resolve(result)
              });
        }else{
            return new Promise(async(resolve, reject) => {
                let result= await productModel.find({category:categy}).lean()
                resolve(result)
              });
        }
       
    } ,
    sortProduct:(data,category)=>{
        return new Promise(async(resolve, reject) => {
            high="high";
            low="low";
            if(category=='all')
            {
              if(data==high){
                let result= await productModel.find().sort({price:-1}).lean()
               resolve(result)
            }else if(data==low){
               let result= await productModel.find().sort({price:1}).lean()
               resolve(result)  
            }
            }else if(category==undefined){
              if(data==high){
                let result= await productModel.find().sort({price:-1}).lean()
               resolve(result)
            }else if(data==low){
               let result= await productModel.find().sort({price:1}).lean()
               resolve(result)  
            }
            }else{
              if(data==high){
                let result= await productModel.find({category:category}).sort({price:-1}).lean()
               resolve(result)
            }else if(data==low){
               let result= await productModel.find({category:category}).sort({price:1}).lean()
               resolve(result)  
            }
            }
          
        });
    } ,  //Search Product
    searchProduct:({productname})=>{
      return new Promise(async(resolve, reject) => {
        let result=await productModel.find({productname:new RegExp(productname,'i')}).lean()
        resolve(result)
      });
    },
   
    listBrand:()=>{
        return new Promise(async(resolve, reject) => {
         let result= await productModel.aggregate([{$group:{_id:'$brand'}}])
         resolve(result)
        });
      },
    brandDetails:(data)=>{
        return new Promise(async(resolve, reject) => {
            let result=await productModel.find({brand:data}).lean()
            resolve(result)
        });
    },
    productDetails:(id)=>{
        return new Promise( async(resolve, reject) => {
         let result= await productModel.findOne({_id:id})
            resolve(result)
        });
      },

      //Add to cart

      productAddCart:(userId,productId)=>{
        return new Promise(async(resolve, reject) => {
          // let quantity=1;
          await userModel.findByIdAndUpdate({_id:userId},{$addToSet:{cart:{
            productId:productId,
            quantity:1
          }}}).then((result)=>{
            resolve(result)
          })           
        });
        
      },

      cartProducts:(userID)=>{
        return new Promise(async(resolve, reject) => {
         const {cart} = await userModel.findOne({_id:userID},{cart:1})
        
        
         resolve(cart)
        });
      },
      quantityInc:(userId,productId)=>{
       
        return new Promise(async(resolve, reject) => {
          // let quantity=2;
          let result= await productModel.findOne({_id:productId},{quandity:1})
         
          
          if(result.quandity>=1){
            await userModel.updateOne({_id:userId,cart:{$elemMatch:{productId:productId}} },{
              $inc:{
                  "cart.$.quantity":1
              }
          })
            let {cart}=await userModel.findOne({_id:userId,cart:{$elemMatch:{productId:productId}} })
            let found=cart.find(e=>e.productId==productId)
            
            resolve(found.quantity)
          }else{
           let qty=1;
           resolve(qty)
          }
        });
      },
      checkQty:(userId,productId)=>{
        return new Promise(async(resolve, reject) => {
          let {cart}= await userModel.findOne({_id:userId,"cart.productId":productId},{_id:0,cart:{$elemMatch:{productId:productId}} })
          
          resolve(cart)
        });
      },

      quantityDec:(userId,productId)=>{
        
        return new Promise(async(resolve, reject) => {
          let result= await productModel.findOne({_id:productId},{quandity:1})
          
          
          if(result.quandity>=0){
            await userModel.updateOne({_id:userId,cart:{$elemMatch:{productId:productId}} },{
              $inc:{
                  "cart.$.quantity":-1
              }
              
          }) 
          let {cart}=await userModel.findOne({_id:userId},{cart:1})
        
            let found=cart.find(e=>e.productId==productId)
           
            resolve(found.quantity)
             
          }
          
          
        
         
        
        });
      },
      cartStockStatus:(productId)=>{
        return new Promise(async(resolve, reject) => {
          await productModel.updateOne({_id:productId},{$set:{stockStatus:true}}).then((result)=>{
            resolve(result)
          })
        });
      },
      cartStockUpdate:(productId)=>{
        return new Promise(async(resolve, reject) => {
          await productModel.updateOne({_id:productId},{$set:{stockStatus:false}}).then((result)=>{
            resolve(result)
          })
        });
      },

      viewCart:(productID)=>{
     
        const cartItems=productID.map(item=>{
          return item.productId
         })
         
        return new Promise(async(resolve, reject) => {
        let result=  await productModel.find({_id:{$in:cartItems}}).lean()
        resolve(result)
         });
      },
      // Delete cart product

      deleteCartProduct:(userID,productID)=>{
        return new Promise(async(resolve, reject) => {
      
       let result=  await userModel.updateOne({_id:userID},{$pull:{cart:{productId:productID}}})
            resolve(result)
        });
      },

      // Wishlist

      productAddWishlist:(userId,productId)=>{
        return new Promise(async(resolve, reject) => {
          
         await productModel.updateOne({_id:productId},{$set:{wlStatus:true}})
        let result= await userModel.updateOne({_id:userId},{$addToSet:{wishlist:productId}})        
        resolve(result) 
        });
      },

      wishlistProducts:(userID)=>{
        return new Promise(async(resolve, reject) => {
         const {wishlist} = await userModel.findOne({_id:userID},{wishlist:1})
         resolve(wishlist)
        
        });
      },
      viewWishlist:(productID)=>{
        return new Promise(async(resolve, reject) => {
        let result=  productModel.find({_id:{$in:productID}}).lean()
        resolve(result)
        });
      },
      deleteWishlistProduct:(userID,productID)=>{
        return new Promise(async(resolve, reject) => {
           await productModel.updateOne({_id:productID},{$set:{wlStatus:false}})
         let result=  await userModel.updateOne({_id:userID},{$pull:{wishlist:productID}})
         resolve(result)
        });
      },


      verifyAddress:(userId,data)=>{
        console.log(data);
        return new Promise(async(resolve, reject) => {
          const {address} = await userModel.findOne({_id:userId},{address:1})
          let addressStatus=address.find(e=>e.address==data.address)
          let cityStatus=address.find(e=>e.city==data.city)
          
          if(addressStatus==undefined || cityStatus==undefined){
            stat=false
            resolve(stat)
          }else{
            stat=true
            resolve(stat)
          }
        });

      },

      addAddress:(userId,data)=>{
        return new Promise(async(resolve, reject) => {
          id=Math.floor(Math.random()*1000000)
         let result=   await userModel.updateOne({_id:userId},{$addToSet:{address:{$each:[{...data,id}]}}})
            resolve(result)
        });
      },
      getAddress:(userId)=>{
        return new Promise(async(resolve, reject) => {
          const {address} = await userModel.findOne({_id:userId},{address:1})
          resolve(address)
        });
    },
    userDetails:(userId)=>{
      return new Promise(async(resolve, reject) => {
       let result= await userModel.findOne({_id:userId})
       resolve(result)
      });
    },
    selectedAddress:(userId,Id)=>{
     let ID=parseInt(Id)
      return new Promise(async(resolve, reject) => {
      let {address}=await userModel.findOne({_id:userId},{address:1})
      let found=address.find(e=>e.id==ID)
        resolve(found)
      });
    }, 
     deletedAddress:(userId,Id)=>{
      let ID=parseInt(Id)
       return new Promise(async(resolve, reject) => {
     let result= await userModel.updateOne({_id:userId},{$pull:{address:{id:ID}}})
        resolve(result)  
       });
     },
     updateAddress:(userId,Id,data)=>{
      let ID=parseInt(Id)
       return new Promise(async(resolve, reject) => {
     let result= await userModel.updateOne({_id:userId,address:{$elemMatch:{id:ID}}},{$set:{"address.$": {
      fname:data.fname,
      lname:data.lname,
      phone:data.phone,
      address:data.address,
      city:data.city,
      state:data.state,
      zip:data.zip,
      id:ID
     } }})
        resolve(result)  
       });
     },
     redeemCoupon:(coupon)=>{
      return new Promise(async(resolve, reject) => {
      let result=await couponModel.find({couponCode:coupon}).lean()
      resolve(result[0])
      });
     },
     orderCheckout:(order,amount,products,address,userID,wallet)=>{
      return new Promise(async(resolve, reject) => {
        let balance=0;
        for(let i=0;i<products.length;i++){
          let subtotal=products[i].subTotal;
          let orderId=Math.floor(Math.random()*1000000)+ Date.now() 
          await orderModel.create({
            orderID:orderId,
            userId:userID,
            orderDate:new Date(),
            address:address,
            paymentStatus:order.payment,
            payment:order.payment,
            products:products[i],
            couponStat:Boolean(order.couponStat),
            subTotal:parseInt(subtotal),
            payAmount:amount,
            totalPrice:parseInt(order.totalPrice)
          }).then((result)=>{
            
             
            resolve(result)
          })
          if(order.wallet=='walletapplied'){
            if(wallet>parseInt(order.totalPrice)){
              await userModel.updateOne({_id:userID},{$inc:{"wallet":-parseInt(order.totalPrice)}}).then((result)=>{
                console.log(result);
              }) 
            }else{
              await userModel.updateOne({_id:userID},{$set:{"wallet":balance}}).then((result)=>{
                console.log(result);
              }) 
            }

          }

          await productModel.updateOne({_id:products[i]._id},{$inc:{"quandity":-products[i].cartQuantity}})
          await userModel.findByIdAndUpdate( userID, { $set: { cart: [] } })
        }
       
      });
     },
     generateRazorpay:(orderID,totalPrice)=>{
      return new Promise((resolve, reject) => {
        const options={
          amount: totalPrice*100,
          currency: "INR",
          receipt: orderID 
        };

       instance.orders.create(options,(err,order)=>{
        resolve(order)
       });
      
      });
     },
     verifyPayment:(details)=>{
      return new Promise((resolve, reject) => {
        let crypto = require('crypto')
        let hamc =crypto.createHmac('sha256', process.env.KEY_SECRET)
        hamc.update(details.payment.razorpay_order_id+'|'+details.payment.razorpay_payment_id)
        hamc=hamc.digest('hex')
        if(hamc==details.payment.razorpay_signature){
          resolve()
        }else{
          reject()
        }
      });
     },

     bannerDetails:()=>{
      return new Promise(async(resolve, reject) => {
        let result=await bannerModel.find().lean()
        resolve(result)
      });
     },
     editUserDetails:(Id)=>{
      return new Promise(async(resolve, reject) => {
        let result=await userModel.findOne({_id:Id})
        resolve(result)
      });
     },
     updateUserDetails:(Id,data)=>{
      return new Promise(async(resolve, reject) => {
        await userModel.updateOne({_id:Id},{$set:{
          fname:data.fname,
          lname:data.lname,
          phone:data.phone
        }}).then((result)=>{
          resolve(result)
        })
      });
     },
     orderHistory:(userId)=>{
      return new Promise(async(resolve, reject) => {
        let result=await orderModel.find({userId:userId}).lean()
        resolve(result)
      });
     },
     getOrderDetails:(Id)=>{
      return new Promise(async(resolve, reject) => {
        let result=await orderModel.findById({_id:Id})
        resolve(result)
      });
     },
     invoice:(orderId)=>{
      return new Promise(async(resolve, reject) => {
        let result=await orderModel.find({_id:orderId}).lean()
        resolve(result)
      });
     },
     cancelOrder:(data,userId)=>{
       
      if(data.payment=='COD'){
        return new Promise(async(resolve, reject) => {
          await orderModel.updateOne({_id:data.orderID},{$set:{cancelStatus:true}}).then((result)=>{
          
            resolve()
          })
          }); 
      }else{
       return new Promise(async(resolve, reject) => {
          await orderModel.updateOne({_id:data.orderID},{$set:{cancelStatus:true}})
          let pdtPrice=parseInt(data.price)
          
          await userModel.updateOne({_id:userId},{$inc:{"wallet":pdtPrice}}).then((result)=>{
            resolve()
          })
          });
      }
      
     },
     returnOrder:(Id)=>{
      return new Promise(async(resolve, reject) => {
        await orderModel.updateOne({_id:Id},{$set:{returnRequest:true}}).then(()=>{
          resolve()
        })
      });
     },
     orderList:(data)=>{
   
      return new Promise(async(resolve, reject) => {
        if(data=='delivered'){
        let result=  await orderModel.find({orderStatus:true}).lean()
        resolve(result)
        }else if(data=='notDelivered'){
          let result=  await orderModel.find({$and:[{orderStatus:false},{cancelStatus:false}]}).lean()
        resolve(result)
        }else if(data=='cancelled'){
          let result=  await orderModel.find({cancelStatus:true}).lean()
          console.log(result);
          resolve(result)
        }else if(data=='all'){
          let result=  await orderModel.find({}).lean()
          resolve(result)
        }
      });
     }
    
}