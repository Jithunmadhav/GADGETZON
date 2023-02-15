const { response } = require('express');
const collection = require('../models/collection');
const productModel=require('../models/productModel')
const adminModel=require('../models/adminModel')
const categoryModel=require('../models/categoryModel')
const couponModel=require('../models/couponModel')
const userModel=require('../models/userModel')
const orderModel=require('../models/orderModel')
const bannerModel=require('../models/bannerModel')
module.exports={

  //***** ADMIN LOGIN ******

    adminLogin:(data)=>{
      let response={

       }
        return new Promise( async(resolve, reject) => {
          let status=  await adminModel.findOne({username:data.username})
       
          if(status){
            if(data.password==status.password){
              response.username=status.username;
              response.stat=true
                resolve(response)
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
      
   await productModel.create({
            productname:pdtData.productname,
            price:parseInt(pdtData.price),
            category:pdtData.category,
            quandity:parseInt(pdtData.quandity),
            brand:pdtData.brand,
            discription:pdtData.discription,
            discription2:pdtData.discription2,
            main_image:fname.main_image,
            sub_image:fname.sub_image,
            productStatus:false,
            wlStatus:false,
            stockStatus:false
   })
   resolve()
      });
    },
    // List category

    listCategory:()=>{
      return new Promise(async(resolve, reject) => {
       let result= await categoryModel.find().lean()
       resolve(result)
      });
    },

    //Get product Details
    getProduct:()=>{
      return new Promise(async(resolve, reject) => {
        let data= await productModel.find().lean()
        resolve(data)
      });
    },
    //Edit product
    editProduct:(id)=>{
      return new Promise( async(resolve, reject) => {
       let result= await productModel.findOne({_id:id}).lean()
        resolve(result)
      });
    },
    //Update Product
    updateProduct:(pdtData,id,fname)=>{
      return new Promise(async(resolve, reject) => {
        console.log(fname);
        if(fname.main_image && fname.sub_image){
        let result=  await productModel.updateOne({_id:id},
          {$set:{
            productname:pdtData.productname,
            price:parseInt(pdtData.price),
            category:pdtData.category,
            quandity:parseInt(pdtData.quandity),
            brand:pdtData.brand,
            discription:pdtData.discription,
            discription2:pdtData.discription2,
            main_image:fname.main_image,
            sub_image:fname.sub_image
           
          }})
          resolve(result)
        }
        if(fname.main_image && !fname.sub_image){
         let result= await productModel.updateOne({_id:id},
          {$set:{
            productname:pdtData.productname,
            price:parseInt(pdtData.price),
            category:pdtData.category,
            quandity:parseInt(pdtData.quandity),
            brand:pdtData.brand,
            discription:pdtData.discription,
            discription2:pdtData.discription2,
            main_image:fname.main_image
          }})
          resolve(result)
        }
        if(!fname.main_image && fname.sub_image){
        let result = await productModel.updateOne({_id:id},
          {$set:{
            productname:pdtData.productname,
            price:parseInt(pdtData.price),
            category:pdtData.category,
            quandity:parseInt(pdtData.quandity),
            brand:pdtData.brand,
            discription:pdtData.discription,
            discription2:pdtData.discription2,
            sub_image:fname.sub_image
          }})
          resolve(result)

        }
        if(!fname.main_image && !fname.sub_image){
         let result= await productModel.updateOne({_id:id},
          {$set:{
            productname:pdtData.productname,
            price:parseInt(pdtData.price),
            category:pdtData.category,
            quandity:parseInt(pdtData.quandity),
            brand:pdtData.brand,
            discription:pdtData.discription,
            discription2:pdtData.discription2,
           
          }})
          resolve(result)
        }
      });
    },
    deleteSubImage:(pdtId,name)=>{
      return new Promise(async(resolve, reject) => {
      let result=  await productModel.updateOne({_id:pdtId},{$pull:{sub_image:{filename:name}}})
      resolve(result)
        // await userModel.updateOne({_id:userID},{$pull:{cart:{productId:productID}}})
      });
    },
//  List and unlist products

    listProduct:(id)=>{
      return new Promise(async(resolve, reject) => {
      let result=  await productModel.updateOne({_id:id},{$set:{productStatus:true}})
      resolve(result)
      });
    },

    unlistProduct:(id)=>{
           return new Promise(async(resolve, reject) => {
        let result=  await productModel.updateOne({_id:id},{$set:{productStatus:false}})
        resolve(result)
      });
    },

    //Delete Product
    deleteProduct:(id)=>{
      console.log(id);
      return new Promise(async(resolve, reject) => {
         let result=await productModel.deleteOne({_id:id})
          resolve(result)
      });
  },
  //Search Product
  searchProduct:({productname})=>{
    return new Promise(async(resolve, reject) => {
      let result=await productModel.find({productname:new RegExp(productname,'i')}).lean()
      resolve(result)
    });
  },


  //****** USER MANAGEMENT ******

  getUserdata:()=>{
    return new Promise(async(resolve, reject) => {
     let result= await userModel.find().lean()
     resolve(result)
    });
  },
 

//Ban User
banUser:(id)=>{
  return new Promise(async(resolve, reject) => {
  let result=  await userModel.updateOne({_id:id},{$set:{ban:true}})
      resolve(result)
  });
},

//Remove Ban
removeBan:(id)=>{
  return new Promise(async(resolve, reject) => {
   let result= await userModel.updateOne({_id:id},{$set:{ban:false}})
      resolve(result)
  });
},

 //Search user
 searchUser:({name})=>{
  return new Promise(async(resolve, reject) => {
    let result=await userModel.find({fname:new RegExp(name,'i')}).lean()
    resolve(result)
  });
},


// *****CATEGORY MANAGEMENT *****
validateCategory:(data)=>{

  return new Promise(async(resolve, reject) => {
    console.log(data);
   let response={}
    let catg= await categoryModel.findOne({categoryname:data})
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
   let result= await categoryModel.create({categoryname:data.categoryname,categoryStatus:false})
      resolve(result)
    
  });
},
allCategory:()=>{
  return new Promise(async(resolve, reject) => {
    let result=await categoryModel.find().lean()
    resolve(result)
  });
},
deleteCategory:(id)=>{
  return new Promise(async(resolve, reject) => {
   let result= await categoryModel.deleteOne({_id:id})
      resolve(result)
    
  });
},
searchCategory:({category})=>{
  return new Promise((resolve, reject) => {
    let result=categoryModel.find({categoryname:new RegExp(category,'i')}).lean()
    // console.log(result);
   resolve(result)
  });
},
editCategory:(id)=>{
  return new Promise(async(resolve, reject) => {
  let result=  await categoryModel.findOne({_id:id})
      resolve(result)
  
  });
},
validateEditCatgy:(data)=>{
  return new Promise(async(resolve, reject) => {
    console.log(data);
   let response={}
    let catg= await categoryModel.findOne({categoryname:data})
    if(catg){
      response.status=true;
      resolve(response)
    }else{
      response.status=false;
      resolve(response)
    }
   
  });
},

updateCategory:(data,id)=>{
  return new Promise(async(resolve, reject) => {
   let result= await categoryModel.updateOne({_id:id},{$set:{
      categoryname:data.categoryname
      
    }})
      resolve(result)
  });

},

// List and unlist Category

listCatgy:(id)=>{
  return new Promise(async(resolve, reject) => {
  let result=  await categoryModel.updateOne({_id:id},{$set:{categoryStatus:true}})
      resolve(result)
  });
},
unlistCatgy:(id)=>{
  return new Promise(async(resolve, reject) => {
  let result=  await categoryModel.updateOne({_id:id},{$set:{categoryStatus:false}})
      resolve(result)
   
  });
},

// *****COUPON MANAGEMENT *****

validateCoupon:(data)=>{

  return new Promise(async(resolve, reject) => {
   let response={}
    let couponName= await couponModel.findOne({couponCode:data.couponCode})
    let couponCode= await couponModel.findOne({couponCode:data.couponCode})
    if(couponName){
      response.status=true;
      resolve(response)
    }else if(couponCode){
      response.status=true;
      resolve(response)
    }
    else{
      response.status=false;
      resolve(response)
    }
   
  });
},

addCoupon:(data)=>{
  return new Promise(async(resolve, reject) => {
  let result=  await couponModel.create({
      couponName:data.couponName,
      couponCode:data.couponCode,
      discountAmt:parseInt(data.discountAmt),
      minPurchaseAmt:parseInt(data.minPurchaseAmt),
      createdDate:new Date(),
      expDate:new Date(data.expDate),
      couponStatus:false
    })
    resolve(result)
  });
},
getCouponDetails:()=>{
  return new Promise(async(resolve, reject) => {
    let result=await couponModel.find().lean()
    resolve(result)
  });
},
listCoupon:(id)=>{
  return new Promise(async(resolve, reject) => {
  let result=  await couponModel.updateOne({_id:id},{$set:{couponStatus:true}}).then((result)=>{
      resolve(result)
    })
  });
},
unlistCoupon:(id)=>{
  return new Promise(async(resolve, reject) => {
  let result=await couponModel.updateOne({_id:id},{$set:{couponStatus:false}})
      resolve(result)
    
  });
},
searchCoupon:({couponName})=>{
  return new Promise(async(resolve, reject) => {
    let result=await couponModel.find({couponName:new RegExp(couponName,'i')}).lean()
   resolve(result)
  });
},
productOrderDetail:()=>{
  return new Promise(async(resolve, reject) => {
   let result= await orderModel.find().lean()
   resolve(result)
  });
},
bannerAdd:(data,file)=>{
  return new Promise(async(resolve, reject) => {
    await bannerModel.create({
      bannerName:data.bannerName,
      main_image:file.main_image,
      bannerStatus:false
    }).then((result)=>{
      resolve(result)
    })
  });
},
getBannerDetails:()=>{
  return new Promise(async(resolve, reject) => {
    let result=await bannerModel.find().lean()
    resolve(result)
  });
},
deleteBanner:(id)=>{
  return new Promise(async(resolve, reject) => {
    await bannerModel.deleteOne({_id:id}).then((result)=>{
      resolve(result)
    })
  });
}



}