const admin=require('../Services/admin')
const express =require('express')
module.exports={

   //****** ADMIN LOGIN ******************

  getLogin:(req,res)=>{
    if(req.session.status){
      
      res.render('admin-login',{result:'invalid user name or password'})
      req.session.status=false
    }else{
      res.render('admin-login')
     
    }
        
    },
  postLogin:(req,res)=>{
      console.log(req.body);
      admin.adminLogin(req.body).then((response)=>{
         
          if(response.status){
             
              res.redirect('/admin/adminDashboard')
             
          }else{
           req.session.status=true;
           console.log(req.session.status);
              res.redirect('/admin/adminLogin')
              
          }
      })
  },

   //****** ADMIN DASHBOARD *************

getDashboard:(req,res)=>{
    res.render('admin-dashboard')
  },

   //****** PRODUCT MANAGEMENT **********

getproductDetails:(req,res)=>{
    admin.getProduct().then((data)=>{
         res.render('admin-product',{data})
    })
},
//Add product


getaddProduct:(req,res)=>{
  admin.listCategory().then((result) => {
    res.render('add-product',{result})
  }).catch((err) => {
    console.log(err);
  });

},


postaddPdt:(req,res)=>{
  
  admin.productData(req.body,req.files).then((result)=>{

      
  })
  res.redirect('/admin/productDetails')
  
  },

//Edit Product

getEditProduct:(req,res)=>{
    
    admin.editProduct(req.params.id).then((result)=>{
      admin.listCategory().then((category)=>{
        res.render('edit-product',{result,category})
      })
        

    })
},
postEditproduct:(req,res)=>{
  console.log(req.body);
  
  admin.updateProduct(req.body,req.params.id,req.files).then((result)=>{
      res.redirect('/admin/productDetails')
  })
},


getListProduct:(req,res)=>{
   
  admin.listProduct(req.params.id).then((result)=>{
      res.redirect('/admin/productDetails')
  })
  },
getUnlistProduct:(req,res)=>{
   
    admin.unlistProduct(req.params.id).then((result)=>{
        res.redirect('/admin/productDetails')
    })
    },
//Search Product

getSearchProduct:(req,res)=>{
    // console.log(req.query);
    admin.searchProduct(req.query).then((data)=>{
      console.log(data);
        res.render('admin-product',{data})
    })
},


//****** USER MANAGEMENT  ***********

getUsermanagement:(req,res)=>{
  admin.getUserdata().then((data)=>{
      res.render('user-manage',{data})
  }).catch((err)=>{
      console.log(err);
  })
 
},


// Ban User

getBanuser:(req,res)=>{
  admin.banUser(req.params.id).then(()=>{
      res.redirect('/admin/userManagement')
  })
  },

 // Remove ban

getRemoveban:(req,res)=>{
  admin.removeBan(req.params.id).then(()=>{
      res.redirect('/admin/bannedUser')
  })
  },

//banned User
getBannedUser:(req,res)=>{
  admin.getUserdata().then((data)=>{
    res.render('banned-user',{data})
}).catch((err)=>{
    console.log(err);
})


},

 //Search user

getSearchuser:(req,res)=>{
  // console.log(req.query);
  admin.searchUser(req.query).then((data)=>{
      res.render('user-manage',{data})
  })
},

      // ****** CATEGORY MANAGEMENT **********

getProductcategory:(req,res)=>{
  admin.allCategory().then((result)=>{
    res.render('product-category',{result})
  }).catch((err)=>{
    console.log(err);
  })
  
},

// Add Category
getAddcategory:(req,res)=>{
  
  res.render('add-category',{result:req.session.categ})
  req.session.categ=false;

},

postAddcategory:(req,res)=>{

  admin.validateCategory(req.body.categoryname).then((result) => {
    if(result.status){
      req.session.categ=result.status;
      res.redirect('/admin/addCategory')
    }else{
      admin.addCategory(req.body).then((result)=>{
        console.log(result);
        res.redirect('/admin/productCategory')
      }).catch((err)=>{
        console.log(err);
      })
    }
  }).catch((err) => {
    console.log(err);
  });
 

},
//Delete Category

getDeleteCategory:(req,res)=>{
  admin.deleteCategory(req.params.id).then(()=>{
    res.redirect('/admin/productCategory')
  }).catch((err)=>{
    console.log(err);
  })
},

// Search category

getSearchCategory:(req,res)=>{
  // console.log(req.query);
  admin.searchCategory(req.query).then((result)=>{
    // console.log(result);
    res.render('product-category',{result})
  }).catch((err)=>{
    console.log(err);
  })
},
// Edit category

getEditCategory:(req,res)=>{
  admin.editCategory(req.params.id).then((result) => {
    res.render('edit-category',{result,status:req.session.categStatus})
    req.session.categStatus=false
    
  }).catch((err) => {
    console.log(err);
  });
  
},


postUpdateCategory:(req,res)=>{
  admin.validateEditCatgy(req.body.categoryname).then((result)=>{
    if(result.status){
      req.session.categStatus=result.status;
      res.redirect('/admin/editCategory')
    }else{
      admin.updateCategory(req.body,req.params.id).then(()=>{
        res.redirect('/admin/productCategory')
      }).catch((err)=>{
        console.log(err);
      })
    }
  });
  
},
// List and Unlist Category

getListCategory:(req,res)=>{
   
  admin.listCatgy(req.params.id).then((result)=>{
      res.redirect('/admin/productCategory')
  })
  },
getUnlistCategory:(req,res)=>{
  admin.unlistCatgy(req.params.id).then((result)=>{
       res.redirect('/admin/productCategory')
  })
  },  

           // ****** COUPON MANAGEMENT **********
getCouponManagement:(req,res)=>{
  admin.getCouponDetails().then((result) => {
     res.render('coupon',{result})
  }).catch((err) => {
    console.log(err);
  });

},

getAddCoupon:(req,res)=>{
  res.render('addCoupon',{result:req.session.couponStatus})
},
postAddCoupon:(req,res)=>{
  admin.validateCoupon(req.body).then((result)=>{
    if(result.status){
      req.session.couponStatus=result.status;
      res.redirect('/admin/addCoupon')
    }else{
      admin.addCoupon(req.body).then((result) => {
        console.log(result);
        res.redirect('/admin/couponManagement')
      }).catch((err) => {
        console.log(err);
      });
    }
  })
  
},
getListCoupon:(req,res)=>{
  admin.listCoupon(req.params.id).then((result)=>{
    res.redirect('/admin/couponManagement')
})

},
getUnlistCoupon:(req,res)=>{
  admin.unlistCoupon(req.params.id).then((result)=>{
    res.redirect('/admin/couponManagement')
})
},
getSearchCoupon:(req,res)=>{
  admin.searchCoupon(req.query).then((result)=>{
    res.render('coupon',{result})
  }).catch((err)=>{
    console.log(err);
  })
},
    
}