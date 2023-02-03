const db=require('../config/connection')
const bcrypt=require('bcrypt');
const collection = require('../models/collection');
const { response } = require('express');
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
                db.get().collection(collection.USER_COLLECTION).insertOne({...userData,Boolean:false,wishlist:[],cart:[],address:[]}).then((data)=>{
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
      }
}