const db=require('../config/connection')
const bcrypt=require('bcrypt');
const collection = require('../models/collection');
const { response } = require('express');
const e = require('express');
const objectid=require('mongodb').ObjectID
module.exports={
    checkSignup:(userData)=>{
        return new Promise(async(resolve, reject) => {
           
            let resp={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            console.log(user);
            if(user){
                console.log("user excist");
                // console.log(user.email);
                // console.log(user.Boolean);
                resp.status=true;
                resp.Boolean=user.Boolean;
                resolve(resp)
            }
            else{
                
                console.log("user not excist");
                resp.status=false;
                resp.Boolean=false;
                resolve(resp)
           
            }
        });
    },

    userSignup:(userData)=>{
        return new Promise(async(resolve, reject) => {
                let Email=userData.email;
                 userData.password=await bcrypt.hash(userData.password,10)
                db.get().collection(collection.USER_COLLECTION).insertOne({...userData,Boolean:false,wishlist:[],cart:[],address:[],checkout:[]}).then((data)=>{
                  resolve(data)
                      
              })
            

        });

       
       
    },

    //User Login

    userLogin:(userData)=>{
        return new Promise(async(resolve, reject) => {
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
              // let userid={

              // }
             
              let status= await bcrypt.compare(userData.password,user.password)
              if(status){
               response.status=status;
               response.Boolean=user.Boolean;
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
            db.get().collection(collection.USER_COLLECTION).updateOne({email},{$set:{password:userpwd.confirmPassword}}).then((result) => {
                resolve(result)
                
            }).catch((err) => {
                console.log(err);
            });
        });
        

    },
     //Get product Details
     getProduct:()=>{
        return new Promise(async(resolve, reject) => {
          let data= await db.get().collection(collection.PRODUCT_DETAILS).find().toArray()
          resolve(data)
        });
      },

    //   list category
    listCategory:()=>{
        return new Promise(async(resolve, reject) => {
         let result= await db.get().collection(collection.PRODUCT_CATEGORY).find().toArray()
         resolve(result)
        });
      },

    getCategoryProducts:(categy)=>{
        let val="all"
        if(categy==val){
            return new Promise(async(resolve, reject) => {
                let data= await db.get().collection(collection.PRODUCT_DETAILS).find().toArray()
                resolve(data)
              });
        }else{
            return new Promise(async(resolve, reject) => {
                let result= await db.get().collection(collection.PRODUCT_DETAILS).find({category:categy}).toArray()
                resolve(result)
              });
        }
       
    } ,
    sortProduct:(data)=>{
        return new Promise(async(resolve, reject) => {
            high="high";
            low="low";
            if(data==high){
                let result= await db.get().collection(collection.PRODUCT_DETAILS).find({}).sort({price:-1}).toArray()
               resolve(result)
            }else if(data==low){
               let result= await db.get().collection(collection.PRODUCT_DETAILS).find().sort({price:1}).toArray()
               resolve(result)  
            }
        });
    } ,  //Search Product
    searchProduct:({productname})=>{
      return new Promise(async(resolve, reject) => {
        let result=await db.get().collection(collection.PRODUCT_DETAILS).find({productname:new RegExp(productname,'i')}).toArray()
        resolve(result)
      });
    },
    listBrand:()=>{
        return new Promise(async(resolve, reject) => {
         let result= await db.get().collection(collection.PRODUCT_DETAILS).aggregate([{$group:{_id:'$brand'}}]).toArray()
         resolve(result)
        });
      },
    brandDetails:(data)=>{
        return new Promise(async(resolve, reject) => {
            let result=await db.get().collection(collection.PRODUCT_DETAILS).find({brand:data}).toArray()
            resolve(result)
        });
    },
    productDetails:(id)=>{
        return new Promise( async(resolve, reject) => {
          await db.get().collection(collection.PRODUCT_DETAILS).findOne({_id:objectid(id)}).then((result) => {
            resolve(result)
          }).catch((err) => {
            console.log(err);
          });
        });
      },

      //Add to cart

      productAddCart:(userId,productId)=>{
        return new Promise(async(resolve, reject) => {
          await db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectid(userId)},{$addToSet:{cart:objectid(productId)}}).then((result) => {
            resolve(result)
          }).catch((err) => {
            console.log(err);
          });
        });
      },

      cartProducts:(userID)=>{
        return new Promise(async(resolve, reject) => {
         const {cart} = await db.get().collection(collection.USER_COLLECTION).findOne({_id:objectid(userID)},{cart:1})
         resolve(cart)
        
        });
      },
      viewCart:(productID)=>{
        return new Promise(async(resolve, reject) => {
        let result=  await db.get().collection(collection.PRODUCT_DETAILS).find({_id:{$in:productID}}).toArray()
        resolve(result)
        });
      },
      // Delete cart product

      deleteCartProduct:(userID,productID)=>{
        return new Promise((resolve, reject) => {
          db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectid(userID)},{$pull:{cart:objectid(productID)}}).then((result) => {
            resolve(result)
          }).catch((err) => {
            console.log(err);
          });
        });
      },

      // Wishlist

      productAddWishlist:(userId,productId)=>{
        return new Promise(async(resolve, reject) => {
          await db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectid(userId)},{$addToSet:{wishlist:objectid(productId)}}).then((result) => {
            resolve(result)
          }).catch((err) => {
            console.log(err);
          });
        });
      },

      wishlistProducts:(userID)=>{
        return new Promise(async(resolve, reject) => {
         const {wishlist} = await db.get().collection(collection.USER_COLLECTION).findOne({_id:objectid(userID)},{wishlist:1})
         resolve(wishlist)
        
        });
      },
      viewWishlist:(productID)=>{
        return new Promise(async(resolve, reject) => {
        let result=  await db.get().collection(collection.PRODUCT_DETAILS).find({_id:{$in:productID}}).toArray()
        resolve(result)
        });
      },
      deleteWishlistProduct:(userID,productID)=>{
        return new Promise((resolve, reject) => {
          db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectid(userID)},{$pull:{wishlist:objectid(productID)}}).then((result) => {
            resolve(result)
          }).catch((err) => {
            console.log(err);
          });
        });
      },


      verifyAddress:(userId,data)=>{
        console.log(data);
        return new Promise(async(resolve, reject) => {
          const {address} = await db.get().collection(collection.USER_COLLECTION).findOne({_id:objectid(userId)},{address:1})
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
          await db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectid(userId)},{$addToSet:{address:{$each:[{...data,id}]}}}).then((result) => {
            resolve(result)
          }).catch((err) => {
            console.log(err);
          });
        });
      },
      getAddress:(userId)=>{
        return new Promise(async(resolve, reject) => {
          const {address} = await db.get().collection(collection.USER_COLLECTION).findOne({_id:objectid(userId)},{address:1})
          resolve(address)
        });
    },
    selectedAddress:(userId,Id)=>{
     let ID=parseInt(Id)
      console.log(typeof ID);
      return new Promise(async(resolve, reject) => {
      let {address}=await db.get().collection(collection.USER_COLLECTION).findOne({_id:objectid(userId)},{address:1})
      let found=address.find(e=>e.id==ID)
        resolve(found)
      });
    }, 
     deletedAddress:(userId,Id)=>{
      let ID=parseInt(Id)
       return new Promise(async(resolve, reject) => {
      await db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectid(userId)},{$pull:{address:{id:ID}}}).then((result)=>{
        resolve(result)
      })  
       });
     },
     redeemCoupon:(coupon)=>{
      return new Promise(async(resolve, reject) => {
      let result=await db.get().collection(collection.COUPON).find({couponCode:coupon}).toArray()
      resolve(result[0])
      });
     }
}