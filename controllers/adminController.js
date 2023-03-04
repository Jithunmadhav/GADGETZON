const admin = require("../Services/admin");
const express = require("express");

module.exports = {
  //****** ADMIN LOGIN ******************

  getLogin: (req, res) => {
    try {
      if (req.session.status) {
        res.render("admin-login", { result: "invalid user name or password" });
        req.session.status = false;
      } else {
        res.render("admin-login");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('An error occurred');
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
    }).catch(err=>{
      console.log(err);
      res.status(500).send('An error occurred');
  })
  },

  //****** ADMIN DASHBOARD *************

  getDashboard: (req, res) => {
    admin.totalSales().then((result)=>{
      res.render("admin-dashboard",{result});
    }).catch(err=>{
      console.log(err);
      res.status(500).send('An error occurred');
  })
   
  },
  getMonthRevenue:(req,res)=>{
    admin.monthRevenue().then((result)=>{
      res.json(result)
    }).catch(err=>{
      console.log(err);
      res.status(500).send('An error occurred');
  })
  },
  getSalesReport:(req,res)=>{
    try {
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
        }).catch(err=>{
          console.log(err);
          res.status(500).send('An error occurred');
      })
      }
      req.session.dateReportStatus=false;
    } catch (error) {
      console.log(error);
      res.status(500).send('An error occurred');
    }
  
  },
  postSalesReport:(req,res)=>{
   admin.dateSalesReport(req.body).then((result)=>{
    req.session.dateReportStatus=true;
    req.session.salesReport=result;
    res.redirect('/admin/salesReport')
   }).catch(err=>{
    console.log(err);
    res.status(500).send('An error occurred');
})
  },
  //****** PRODUCT MANAGEMENT **********

  getproductDetails: (req, res) => {
    admin.getProduct().then((data) => {
      res.render("admin-product", { data });
    }).catch(err=>{
      console.log(err);
      res.status(500).send('An error occurred');
  })
  },
  //Add product

  getaddProduct: (req, res) => {
    admin
      .listCategory()
      .then((result) => {
        res.render("add-product", { result });
      })
      .catch(err=>{
        console.log(err);
        res.status(500).send('An error occurred');
    })
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
      }).catch(err=>{
        console.log(err);
        res.status(500).send('An error occurred');
    })
    }).catch(err=>{
      console.log(err);
      res.status(500).send('An error occurred');
  })
  },
  getDeleteSubImage: (req, res) => {
    admin.deleteSubImage(req.session.productId, req.params.name).then(() => {
      res.redirect("back");
    }).catch(err=>{
      console.log(err);
      res.status(500).send('An error occurred');
  })
  },

  postEditproduct: (req, res) => {
    admin.updateProduct(req.body, req.params.id, req.files).then((result) => {
      res.redirect("/admin/productDetails");
    }).catch(err=>{
      console.log(err);
      res.status(500).send('An error occurred');
  })
  },

  getListProduct: (req, res) => {
    admin.listProduct(req.params.id).then((result) => {
      res.redirect("/admin/productDetails");
    }).catch(err=>{
      console.log(err);
      res.status(500).send('An error occurred');
  })
  },
  getUnlistProduct: (req, res) => {
    admin.unlistProduct(req.params.id).then((result) => {
      res.redirect("/admin/productDetails");
    }).catch(err=>{
      console.log(err);
      res.status(500).send('An error occurred');
  })
  },
  //Search Product

  getSearchProduct: (req, res) => {
    // console.log(req.query);
    admin.searchProduct(req.query).then((data) => {
      console.log(data);
      res.render("admin-product", { data });
    }).catch(err=>{
      console.log(err);
      res.status(500).send('An error occurred');
  })
  },

  //****** USER MANAGEMENT  ***********

  getUsermanagement: (req, res) => {
    admin
      .getUserdata()
      .then((data) => {
        res.render("user-manage", { data });
      })
      .catch(err=>{
        console.log(err);
        res.status(500).send('An error occurred');
    })
  },

  // Ban User

  getBanuser: (req, res) => {
    admin.banUser(req.params.id).then(() => {
      res.redirect("/admin/userManagement");
    }).catch(err=>{
      console.log(err);
      res.status(500).send('An error occurred');
  })
  },

  // Remove ban

  getRemoveban: (req, res) => {
    admin.removeBan(req.params.id).then(() => {
      res.redirect("/admin/bannedUser");
    }).catch(err=>{
      console.log(err);
      res.status(500).send('An error occurred');
  })
  },

  //banned User
  getBannedUser: (req, res) => {
    admin
      .getUserdata()
      .then((data) => {
        res.render("banned-user", { data });
      })
      .catch(err=>{
        console.log(err);
        res.status(500).send('An error occurred');
    })
  },

  //Search user

  getSearchuser: (req, res) => {
    // console.log(req.query);
    admin.searchUser(req.query).then((data) => {
      res.render("user-manage", { data });
    }).catch(err=>{
      console.log(err);
      res.status(500).send('An error occurred');
  })
  },

  // ****** CATEGORY MANAGEMENT **********

  getProductcategory: (req, res) => {
    admin
      .allCategory()
      .then((result) => {
        res.render("product-category", { result });
      })
      .catch(err=>{
        console.log(err);
        res.status(500).send('An error occurred');
    })
  },

  // Add Category
  getAddcategory: (req, res) => {
    try {
      res.render("add-category", { result: req.session.categ });
      req.session.categ = false;
    } catch (error) {
      console.log(error);
        res.status(500).send('An error occurred');
    }

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
               res.status(500).send('An error occurred');
            });
        }
      })
      .catch((err) => {
        console.log(err);
         res.status(500).send('An error occurred');
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
         res.status(500).send('An error occurred');
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
         res.status(500).send('An error occurred');
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
         res.status(500).send('An error occurred');
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
             res.status(500).send('An error occurred');
          });
      }
    }).catch((err) => {
      console.log(err);
       res.status(500).send('An error occurred');
    });
  },
  // List and Unlist Category

  getListCategory: (req, res) => {
    admin.listCatgy(req.params.id).then((result) => {
      res.redirect("/admin/productCategory");
    }).catch((err) => {
      console.log(err);
       res.status(500).send('An error occurred');
    });
  },
  getUnlistCategory: (req, res) => {
    admin.unlistCatgy(req.params.id).then((result) => {
      res.redirect("/admin/productCategory");
    }).catch((err) => {
      console.log(err);
       res.status(500).send('An error occurred');
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
         res.status(500).send('An error occurred');
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
             res.status(500).send('An error occurred');
          });
      }
    }).catch((err) => {
      console.log(err);
       res.status(500).send('An error occurred');
    });
  },
  getListCoupon: (req, res) => {
    admin.listCoupon(req.params.id).then((result) => {
      res.redirect("/admin/couponManagement");
    }).catch((err) => {
      console.log(err);
       res.status(500).send('An error occurred');
    });
  },
  getUnlistCoupon: (req, res) => {
    admin.unlistCoupon(req.params.id).then((result) => {
      res.redirect("/admin/couponManagement");
    }).catch((err) => {
      console.log(err);
       res.status(500).send('An error occurred');
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
         res.status(500).send('An error occurred');
      });
  },
  getOrderManagement: (req, res) => {
    req.session.pageNum=parseInt(req.query.page??1) 
        req.session.perpage=8;
    admin.productOrderDetail(req.session.pageNum,req.session.perpage).then((result) => {
      let pageCount=Math.ceil(result.docCount/req.session.perpage)
      let pagination=[]
      for(i=1;i<=pageCount;i++){
      pagination.push(i)
      }
     let orderResult=result.result;
      for(i=0;i<orderResult.length;i++){
        orderResult.map((item, index)=>{
          orderResult[i].date=orderResult[i].orderDate.toDateString();
          })
      }
      res.render("orderMangement", { orderResult,pagination });
    }).catch((err) => {
      console.log(err);
       res.status(500).send('An error occurred');
    });
  },
  getEditOrderStatus: (req, res) => {
    admin.editOrderStatus(req.params.id).then((result) => {
      res.render("editOrderStatus", { result });
    }).catch((err) => {
      console.log(err);
       res.status(500).send('An error occurred');
    });
  },
  postEditOrderStatus: (req, res) => {
    admin.updateOrderStatus(req.params.id, req.body).then(() => {
      res.redirect("/admin/orderManagement");
    }).catch((err) => {
      console.log(err);
       res.status(500).send('An error occurred');
    });
  },
  getBannerManagement: (req, res) => {
    admin.getBannerDetails().then((result) => {
      res.render("bannerManagement", { result });
    }).catch((err) => {
      console.log(err);
       res.status(500).send('An error occurred');
    });
  },
  getAddBanner: (req, res) => {
    res.render("addBanner");
  },
  postAddBanner: (req, res) => {
    admin.bannerAdd(req.body, req.files).then((result) => {
      res.redirect("/admin/bannerManagement");
    }).catch((err) => {
      console.log(err);
       res.status(500).send('An error occurred');
    });
  },
  getDeleteBanner: (req, res) => {
    admin.deleteBanner(req.params.id).then((result) => {
      res.redirect("back");
    }).catch((err) => {
      console.log(err);
       res.status(500).send('An error occurred');
    });
  },
  getReturnConfirm: (req, res) => {
 
    admin.returnConfirm(req.params.id, req.body).then(() => {
      res.redirect("/admin/orderManagement");
    }).catch((err) => {
      console.log(err);
       res.status(500).send('An error occurred');
    });
  },

  getPdtDetails:(req,res)=>{
    admin.getOrderDetails(req.params.id).then((result)=>{
      
      res.render('orderedPdtDetails',{result})
  }).catch((err) => {
    console.log(err);
     res.status(500).send('An error occurred');
  });
  }
};
