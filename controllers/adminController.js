const admin = require("../Services/admin");
const express = require("express");
const { render } = require("easyinvoice");
module.exports = {
  //****** ADMIN LOGIN ******************

  getLogin: (req, res) => {
    if (req.session.status) {
      res.render("admin-login", { result: "invalid user name or password" });
      req.session.status = false;
    } else {
      res.render("admin-login");
    }
  },
  postLogin: (req, res) => {
    
    admin.adminLogin(req.body).then((response) => {
      req.session.admin = response.username;
      if (response.stat) {
        res.redirect("/admin/adminDashboard");
      } else {
        req.session.status = true;

        res.redirect("/admin/adminLogin");
      }
    });
  },

  //****** ADMIN DASHBOARD *************

  getDashboard: (req, res) => {
    admin.totalSales().then((result)=>{
      res.render("admin-dashboard",{result});
    })
   
  },
  getMonthRevenue:(req,res)=>{
    admin.monthRevenue().then((result)=>{
      res.json(result)
    })
  },
  getSalesReport:(req,res)=>{
    if(req.session.dateReportStatus){
      let result=req.session.salesReport;
      let count=result.length;
      let status=(count==0)?true:false;
      let total = result.reduce((acc, item) => {
        return acc += item.subTotal ;
    }, 0);
       
      res.render('salesReport',{result,total,status})
    }else{
      admin.allSalesReport().then((result)=>{
        let count=result.length;
        let status=(count==0)?true:false;
        let total=result.reduce((acc,item)=>{
          return acc+=item.subTotal;
        },0)
        res.render('salesReport',{result,total,status})
      })
    }
    req.session.dateReportStatus=false;
  },
  postSalesReport:(req,res)=>{
   admin.dateSalesReport(req.body).then((result)=>{
    req.session.dateReportStatus=true;
    req.session.salesReport=result;
    res.redirect('/admin/salesReport')
   })
  },
  //****** PRODUCT MANAGEMENT **********

  getproductDetails: (req, res) => {
    admin.getProduct().then((data) => {
      res.render("admin-product", { data });
    });
  },
  //Add product

  getaddProduct: (req, res) => {
    admin
      .listCategory()
      .then((result) => {
        res.render("add-product", { result });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  postaddPdt: (req, res) => {
    admin.productData(req.body, req.files).then((result) => {
      res.redirect("/admin/productDetails");
    });
  },

  //Edit Product

  getEditProduct: (req, res) => {
    admin.editProduct(req.params.id).then((result) => {
      admin.listCategory().then((category) => {
        req.session.productId = result._id;
        res.render("edit-product", { result, category });
      });
    });
  },
  getDeleteSubImage: (req, res) => {
    admin.deleteSubImage(req.session.productId, req.params.name).then(() => {
      res.redirect("back");
    });
  },

  postEditproduct: (req, res) => {
    admin.updateProduct(req.body, req.params.id, req.files).then((result) => {
      res.redirect("/admin/productDetails");
    });
  },

  getListProduct: (req, res) => {
    admin.listProduct(req.params.id).then((result) => {
      res.redirect("/admin/productDetails");
    });
  },
  getUnlistProduct: (req, res) => {
    admin.unlistProduct(req.params.id).then((result) => {
      res.redirect("/admin/productDetails");
    });
  },
  //Search Product

  getSearchProduct: (req, res) => {
    // console.log(req.query);
    admin.searchProduct(req.query).then((data) => {
      console.log(data);
      res.render("admin-product", { data });
    });
  },

  //****** USER MANAGEMENT  ***********

  getUsermanagement: (req, res) => {
    admin
      .getUserdata()
      .then((data) => {
        res.render("user-manage", { data });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  // Ban User

  getBanuser: (req, res) => {
    admin.banUser(req.params.id).then(() => {
      res.redirect("/admin/userManagement");
    });
  },

  // Remove ban

  getRemoveban: (req, res) => {
    admin.removeBan(req.params.id).then(() => {
      res.redirect("/admin/bannedUser");
    });
  },

  //banned User
  getBannedUser: (req, res) => {
    admin
      .getUserdata()
      .then((data) => {
        res.render("banned-user", { data });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  //Search user

  getSearchuser: (req, res) => {
    // console.log(req.query);
    admin.searchUser(req.query).then((data) => {
      res.render("user-manage", { data });
    });
  },

  // ****** CATEGORY MANAGEMENT **********

  getProductcategory: (req, res) => {
    admin
      .allCategory()
      .then((result) => {
        res.render("product-category", { result });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  // Add Category
  getAddcategory: (req, res) => {
    res.render("add-category", { result: req.session.categ });
    req.session.categ = false;
  },

  postAddcategory: (req, res) => {
    admin
      .validateCategory(req.body.categoryname)
      .then((result) => {
        if (result.status) {
          req.session.categ = result.status;
          res.redirect("/admin/addCategory");
        } else {
          admin
            .addCategory(req.body)
            .then((result) => {
              console.log(result);
              res.redirect("/admin/productCategory");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  //Delete Category

  getDeleteCategory: (req, res) => {
    admin
      .deleteCategory(req.params.id)
      .then(() => {
        res.redirect("/admin/productCategory");
      })
      .catch((err) => {
        console.log(err);
      });
  },

  // Search category

  getSearchCategory: (req, res) => {
    // console.log(req.query);
    admin
      .searchCategory(req.query)
      .then((result) => {
        // console.log(result);
        res.render("product-category", { result });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  // Edit category

  getEditCategory: (req, res) => {
    admin
      .editCategory(req.params.id)
      .then((result) => {
        res.render("edit-category", {
          result,
          status: req.session.categStatus,
        });
        req.session.categStatus = false;
      })
      .catch((err) => {
        console.log(err);
      });
  },

  postUpdateCategory: (req, res) => {
    admin.validateEditCatgy(req.body.categoryname).then((result) => {
      if (result.status) {
        req.session.categStatus = result.status;
        res.redirect("/admin/editCategory");
      } else {
        admin
          .updateCategory(req.body, req.params.id)
          .then(() => {
            res.redirect("/admin/productCategory");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  },
  // List and Unlist Category

  getListCategory: (req, res) => {
    admin.listCatgy(req.params.id).then((result) => {
      res.redirect("/admin/productCategory");
    });
  },
  getUnlistCategory: (req, res) => {
    admin.unlistCatgy(req.params.id).then((result) => {
      res.redirect("/admin/productCategory");
    });
  },

  // ****** COUPON MANAGEMENT **********
  getCouponManagement: (req, res) => {
    admin
      .getCouponDetails()
      .then((result) => {
        res.render("coupon", { result });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  getAddCoupon: (req, res) => {
    res.render("addCoupon", { result: req.session.couponStatus });
  },
  postAddCoupon: (req, res) => {
    admin.validateCoupon(req.body).then((result) => {
      if (result.status) {
        req.session.couponStatus = result.status;
        res.redirect("/admin/addCoupon");
      } else {
        admin
          .addCoupon(req.body)
          .then((result) => {
            console.log(result);
            res.redirect("/admin/couponManagement");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  },
  getListCoupon: (req, res) => {
    admin.listCoupon(req.params.id).then((result) => {
      res.redirect("/admin/couponManagement");
    });
  },
  getUnlistCoupon: (req, res) => {
    admin.unlistCoupon(req.params.id).then((result) => {
      res.redirect("/admin/couponManagement");
    });
  },
  getSearchCoupon: (req, res) => {
    admin
      .searchCoupon(req.query)
      .then((result) => {
        res.render("coupon", { result });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getOrderManagement: (req, res) => {
    admin.productOrderDetail().then((result) => {
     
      for(i=0;i<result.length;i++){
        result.map((item, index)=>{
          result[i].date=result[i].orderDate.toDateString();
          })
      }
     
      
      
      res.render("orderMangement", { result });
    });
  },
  getEditOrderStatus: (req, res) => {
    admin.editOrderStatus(req.params.id).then((result) => {
      res.render("editOrderStatus", { result });
    });
  },
  postEditOrderStatus: (req, res) => {
    admin.updateOrderStatus(req.params.id, req.body).then(() => {
      res.redirect("/admin/orderManagement");
    });
  },
  getBannerManagement: (req, res) => {
    admin.getBannerDetails().then((result) => {
      res.render("bannerManagement", { result });
    });
  },
  getAddBanner: (req, res) => {
    res.render("addBanner");
  },
  postAddBanner: (req, res) => {
    admin.bannerAdd(req.body, req.files).then((result) => {
      res.redirect("/admin/bannerManagement");
    });
  },
  getDeleteBanner: (req, res) => {
    admin.deleteBanner(req.params.id).then((result) => {
      res.redirect("back");
      console.log(result);
    });
  },
  getReturnConfirm: (req, res) => {
 
    admin.returnConfirm(req.params.id, req.body).then(() => {
      res.redirect("/admin/orderManagement");
    });
  },

  getPdtDetails:(req,res)=>{
    admin.getOrderDetails(req.params.id).then((result)=>{
      
      res.render('orderedPdtDetails',{result})
  })
  }
};
