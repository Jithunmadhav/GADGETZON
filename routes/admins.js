
const { response } = require('express')
const express=require('express')
const adminController = require('../controllers/adminController')
const adminVerify = require('../middlewares/adminSession')
const multipleUpload = require('../helpers/multer')
const router=express.Router()


             // ****** ADMIN LOGIN **********
             

router.get('/adminLogin',adminController.getLogin)



router.post('/admLog',adminController.postLogin)
router.use(adminVerify)

            // ****** ADMIN DASHBOARD **********

router.get('/adminDashboard',adminController.getDashboard)

router.get('/monthRevenue',adminController.getMonthRevenue)                                                     

router.get('/salesReport',adminController.getSalesReport)

router.post('/salesReport',adminController.postSalesReport)
            // ****** PRODUCT MANAGEMENT **********

router.get('/productDetails',adminController.getproductDetails)

//Add product

router.get('/addProduct',adminController.getaddProduct)

router.post('/addPdt',multipleUpload,adminController.postaddPdt)

//Edit Product

router.get('/editProduct/:id',adminController.getEditProduct)

router.post('/edit-product/:id',multipleUpload,adminController.postEditproduct)

router.get('/deleteSubImage/:name',adminController.getDeleteSubImage)

//Delete Product

router.get('/listProduct/:id',adminController.getListProduct)
router.get('/unlistProduct/:id',adminController.getUnlistProduct)

//Search Product
router.get('/searchProduct',adminController.getSearchProduct)


            // ****** USER MANAGEMENT  *******

router.get('/userManagement',adminController.getUsermanagement)


// Ban User
router.get('/banUser/:id',adminController.getBanuser)

// Remove ban
router.get('/removeBan/:id',adminController.getRemoveban)

//Search user
router.get('/searchUser',adminController.getSearchuser)

//Banned User

router.get('/bannedUser',adminController.getBannedUser)

           // ****** CATEGORY MANAGEMENT **********

router.get('/productCategory',adminController.getProductcategory)

router.get('/addCategory',adminController.getAddcategory)

router.post('/add-category',adminController.postAddcategory)

router.get('/deleteCategory/:id',adminController.getDeleteCategory)

router.get('/searchCategory',adminController.getSearchCategory)

router.get('/editCategory/:id',adminController.getEditCategory)

router.get('/editCategory',adminController.getEditCategory)

router.post('/updateCategory/:id',adminController.postUpdateCategory)

router.get('/listCategory/:id',adminController.getListCategory)

router.get('/unlistCategory/:id',adminController.getUnlistCategory)



           // ****** COUPON MANAGEMENT **********

router.get('/couponManagement',adminController.getCouponManagement)

router.get('/addcoupon',adminController.getAddCoupon)

router.post('/postCoupon',adminController.postAddCoupon)

router.get('/listCoupon/:id',adminController.getListCoupon)

router.get('/unlistCoupon/:id',adminController.getUnlistCoupon)

router.get('/searchCoupon',adminController.getSearchCoupon)

router.get('/orderManagement',adminController.getOrderManagement)

router.get('/editOrderStatus/:id',adminController.getEditOrderStatus)

router.post('/editOrderStatus/:id',adminController.postEditOrderStatus)


router.get('/orderedPdtDetails/:id',adminController.getPdtDetails)

//************Banner Management ******

router.get('/bannerManagement',adminController.getBannerManagement)

router.get('/addBanner',adminController.getAddBanner)

router.post('/postAddBanner',multipleUpload,adminController.postAddBanner)

router.get('/bannerDelete/:id',adminController.getDeleteBanner)



router.post('/editReturnStatus/:id',adminController.getReturnConfirm)

module.exports=router;