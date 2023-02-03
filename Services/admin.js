const { response } = require('express');
const db=require('../config/connection')
const collection = require('../models/collection');
const objectid=require('mongodb').ObjectID
module.exports={

  //***** ADMIN LOGIN ******

    adminLogin:(data)=>{
        console.log("data"+data.password);
        return new Promise( async(resolve, reject) => {
          let status=  await db.get().collection(collection.ADMIN_LOGIN).findOne({username:data.username})
          
          if(status){
            if(data.password==status.password){
                resolve({status:true})
                console.log("Login successfull");
            }
            else{
                resolve({status:false})
                console.log("Login deneid");
            }
          }else {
            resolve({status:false})
          console.log("login failed");
          }
        });
    },

    // ***** PRODUCT MANAGEMENT ******

    //Add product
    
    productData:(pdtData,fname)=>{
      return new Promise(async(resolve, reject) => {
   
        await db.get().collection(collection.PRODUCT_DETAILS).insertOne({
            productname:pdtData.productname,
            price:parseInt(pdtData.price),
            category:pdtData.category,
            quandity:parseInt(pdtData.quandity),
            brand:pdtData.brand,
            discription:pdtData.discription,
            main_image:fname.main_image,
            sub_image:fname.sub_image
          }).then((result) => {
            resolve(result)


        }).catch((err) => {
          console.log("error",err);
        });
      });
    },
    // List category

    listCategory:()=>{
      return new Promise(async(resolve, reject) => {
       let result= await db.get().collection(collection.PRODUCT_CATEGORY).find().toArray()
       resolve(result)
      });
    },

    //Get product Details
    getProduct:()=>{
      return new Promise(async(resolve, reject) => {
        let data= await db.get().collection(collection.PRODUCT_DETAILS).find().toArray()
        resolve(data)
      });
    },
    //Edit product
    editProduct:(id)=>{
      return new Promise( async(resolve, reject) => {
        await db.get().collection(collection.PRODUCT_DETAILS).findOne({_id:objectid(id)}).then((result) => {
          resolve(result)
        }).catch((err) => {
          console.log(err);
        });
      });
    },
    //Update Product
    updateProduct:(pdtData,id,fname)=>{
      return new Promise(async(resolve, reject) => {
        console.log(fname);
        if(fname.main_image && fname.sub_image){
          await db.get().collection(collection.PRODUCT_DETAILS).updateOne({_id:objectid(id)},
          {$set:{
            productname:pdtData.productname,
            price:parseInt(pdtData.price),
            category:pdtData.category,
            quandity:parseInt(pdtData.quandity),
            brand:pdtData.brand,
            discription:pdtData.discription,
            main_image:fname.main_image,
            sub_image:fname.sub_image
           
          }}).then((result)=>{
            resolve(result)
          })
        }
        if(fname.main_image && !fname.sub_image){
          await db.get().collection(collection.PRODUCT_DETAILS).updateOne({_id:objectid(id)},
          {$set:{
            productname:pdtData.productname,
            price:parseInt(pdtData.price),
            category:pdtData.category,
            quandity:parseInt(pdtData.quandity),
            brand:pdtData.brand,
            discription:pdtData.discription,
            main_image:fname.main_image
          }}).then((result)=>{
            resolve(result)
          })
        }
        if(!fname.main_image && fname.sub_image){
          await db.get().collection(collection.PRODUCT_DETAILS).updateOne({_id:objectid(id)},
          {$set:{
            productname:pdtData.productname,
            price:parseInt(pdtData.price),
            category:pdtData.category,
            quandity:parseInt(pdtData.quandity),
            brand:pdtData.brand,
            discription:pdtData.discription,
            sub_image:fname.sub_image
          }}).then((result)=>{
            resolve(result)
          })

        }
        if(!fname.main_image && !fname.sub_image){
          await db.get().collection(collection.PRODUCT_DETAILS).updateOne({_id:objectid(id)},
          {$set:{
            productname:pdtData.productname,
            price:parseInt(pdtData.price),
            category:pdtData.category,
            quandity:parseInt(pdtData.quandity),
            brand:pdtData.brand,
            discription:pdtData.discription,
            
          }}).then((result)=>{
            resolve(result)
          })
        }
      });
    },
//  List and unlist products

    listProduct:(id)=>{
      return new Promise(async(resolve, reject) => {
        await db.get().collection(collection.PRODUCT_DETAILS).updateOne({_id:objectid(id)},{$set:{Boolean:true}}).then((result)=>{
          resolve(result)
        })
      });
    },

    unlistProduct:(id)=>{
      return new Promise(async(resolve, reject) => {
        await db.get().collection(collection.PRODUCT_DETAILS).updateOne({_id:objectid(id)},{$set:{Boolean:false}}).then((result)=>{
          resolve(result)
        })
      });
    },

    //Delete Product
    deleteProduct:(id)=>{
      console.log(id);
      return new Promise((resolve, reject) => {
          db.get().collection(collection.PRODUCT_DETAILS).deleteOne({_id:objectid(id)}).then((result)=>{
            resolve(result)
          })
      });
  },
  //Search Product
  searchProduct:({productname})=>{
    return new Promise(async(resolve, reject) => {
      let result=await db.get().collection(collection.PRODUCT_DETAILS).find({productname:new RegExp(productname,'i')}).toArray()
      resolve(result)
    });
  },


  //****** USER MANAGEMENT ******

  getUserdata:()=>{
    return new Promise(async(resolve, reject) => {
     let user= await db.get().collection(collection.USER_COLLECTION).find().toArray()
     resolve(user)
    });
  },
 

//Ban User
banUser:(id)=>{
  return new Promise(async(resolve, reject) => {
    await db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectid(id)},{$set:{Boolean:true}}).then((result)=>{
      resolve(result)
    })
  });
},

//Remove Ban
removeBan:(id)=>{
  return new Promise(async(resolve, reject) => {
    await db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectid(id)},{$set:{Boolean:false}}).then((result)=>{
      resolve(result)
    })
  });
},

 //Search user
 searchUser:({name})=>{
  return new Promise(async(resolve, reject) => {
    let result=await db.get().collection(collection.USER_COLLECTION).find({fname:new RegExp(name,'i')}).toArray()
    resolve(result)
  });
},


// *****CATEGORY MANAGEMENT *****
validateCategory:(data)=>{

  return new Promise(async(resolve, reject) => {
    console.log(data);
   let response={}
    let catg= await db.get().collection(collection.PRODUCT_CATEGORY).findOne({categoryname:data})
    if(catg){
      response.status=true;
      resolve(response)
    }else{
      response.status=false;
      resolve(response)
    }
   
  });
},

addCategory:(data)=>{
  return new Promise( async(resolve, reject) => {
    await db.get().collection(collection.PRODUCT_CATEGORY).insertOne(data).then((data)=>{
      resolve(data)
    })
  });
},
allCategory:()=>{
  return new Promise(async(resolve, reject) => {
    let result=await db.get().collection(collection.PRODUCT_CATEGORY).find().toArray()
    resolve(result)
  });
},
deleteCategory:(id)=>{
  return new Promise(async(resolve, reject) => {
    await db.get().collection(collection.PRODUCT_CATEGORY).deleteOne({_id:objectid(id)}).then((data)=>{
      resolve(data)
    })
  });
},
searchCategory:({category})=>{
  return new Promise(async(resolve, reject) => {
    let result=await db.get().collection(collection.PRODUCT_CATEGORY).find({categoryname:new RegExp(category,'i')}).toArray()
    // console.log(result);
   resolve(result)
  });
},
editCategory:(id)=>{
  return new Promise(async(resolve, reject) => {
    await db.get().collection(collection.PRODUCT_CATEGORY).findOne({_id:objectid(id)}).then((result)=>{
      resolve(result)
    })
  });
},

updateCategory:(data,id)=>{
  return new Promise(async(resolve, reject) => {
    await db.get().collection(collection.PRODUCT_CATEGORY).updateOne({_id:objectid(id)},{$set:{
      categoryname:data.categoryname
    }}).then((result)=>{
      resolve(result)
    })
  });

}

}