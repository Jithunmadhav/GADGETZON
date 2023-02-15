
const bcrypt=require('bcrypt');
const { response } = require('express');
const e = require('express');
const userModel = require('../models/userModel');
const productModel=require('../models/productModel')
const categoryModel=require('../models/categoryModel')
const couponModel=require('../models/couponModel')
const orderModel=require('../models/orderModel')
module.exports={
    checkSignup:(userData)=>{
        return new Promise(async(resolve, reject) => {
           
            let resp={}
            let user=await userModel.findOne({email:userData.email})
            
            if(user){
                console.log("user excist");
                // console.log(user.email);
                // console.log(user.Boolean);
                resp.status=true;
                resp.ban=user.ban;
                resolve(resp)
            }
            else{
                
                console.log("user not excist");
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
    sortProduct:(data)=>{
        return new Promise(async(resolve, reject) => {
            high="high";
            low="low";
            if(data==high){
                let result= await productModel.find({}).sort({price:-1}).lean()
               resolve(result)
            }else if(data==low){
               let result= await productModel.find().sort({price:1}).lean()
               resolve(result)  
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
         
          
          if(result.quandity>1){
            await userModel.updateOne({_id:userId,cart:{$elemMatch:{productId:productId}} },{
              $inc:{
                  "cart.$.quantity":1
              }
          }).then((result)=>{
              resolve(result)
            })
            await productModel.updateOne({_id:productId},{$inc:{"quandity":-1}})
          }else{
           
            await productModel.updateOne({_id:productId},{$set:{stockStatus:true}}).then((result)=>{
              resolve(result)
            })
          }
        //   await userModel.updateOne({_id:userId,cart:{$elemMatch:{productId:productId}} },{
        //     $inc:{
        //         "cart.$.quantity":1
        //     }
        // }).then((result)=>{
        //     resolve(result)
        //   })
        //   let quan= await productModel.updateOne({_id:productId},{$inc:{"quandity":-1}})
        //  console.log(quan);
        });
      },
      checkQty:(userId,productId)=>{
        return new Promise(async(resolve, reject) => {
          let {cart}= await userModel.findOne({"cart.productId":productId},{_id:0,cart:{$elemMatch:{productId:productId}} })
          resolve(cart)
        });
      },

      quantityDec:(userId,productId)=>{
        return new Promise(async(resolve, reject) => {

          let result= await productModel.findOne({_id:productId},{quandity:1})
          console.log(result.quandity);
          
          if(result.quandity>=0){
            await userModel.updateOne({_id:userId,cart:{$elemMatch:{productId:productId}} },{
              $inc:{
                  "cart.$.quantity":-1
              }
          }).then((result)=>{
              resolve(result)
            })
            await productModel.updateOne({_id:productId},{$inc:{"quandity":1}})
          }
          // let quantity= await productModel.updateOne({_id:productId},{$inc:{"quandity":1}})
          //    console.log(quantity);
          
        
         
        
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
            console.log("not excist");
            stat=false
            resolve(stat)
          }else{
            console.log("already excist");
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
     redeemCoupon:(coupon)=>{
      return new Promise(async(resolve, reject) => {
      let result=await couponModel.find({couponCode:coupon}).lean()
      resolve(result[0])
      });
     },
     orderCheckout:(order,products,userID)=>{
      return new Promise(async(resolve, reject) => {
        for(let i=0;i<products.length;i++){
          let orderId=Math.floor(Math.random()*1000000)+ Date.now() 
          await orderModel.create({
            orderId:orderId,
            orderDate:new Date,
            orderStatus:false,
            address:order.address,
            paymentStatus:false,
            payment:order.payment,
            products:products[i],
            couponStat:Boolean(order.couponStat),
            totalPrice:parseInt(order.totalPrice)
          }).then((result)=>{
            
             
            resolve(result)
          })
        }
        return new Promise(async(resolve, reject) => {
         
          await userModel.updateOne(({_id:userID},{$set:{cart:[]}}))
        });
      });
     }
}