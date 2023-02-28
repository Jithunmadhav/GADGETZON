const { response } = require('express')
const express =require('express')
const user = require('../Services/user')
const userController=require('../controllers/userController')
const sentOTP = require('../helpers/sentOTP')
const adminController = require('../controllers/adminController')
const verifyUser = require('../middlewares/userSession')
const banUserAccount = require('../middlewares/banUser')
 


const router=express.Router()



// user-login-page
router.get('/login',userController.getLogin)

router.post('/loginpost',userController.postLogin)

// router.get('/loginVerify',userController.getLoginVerify)

// router.get('/resendOTP',userController.getResendOTP)

// router.post('/postLoginVerify',userController.postLoginVerify)

// user-signup-page
router.get('/signup',userController.getSignup)

router.post('/signUP',userController.postSignup)

// Signup-verification-page
router.get('/signupVerify',userController.getSignupVerify)


router.get('/resendOtp',userController.getResendOtp)

router.get('/resendForgotOtp',userController.getResendOTp)

router.post('/postSignup',userController.postSignupVerify)

// forgot-password-page

router.get('/forgotPasword',userController.getForgotPassword)

router.post('/forgotpwd',userController.postForgotPassword)

// Verify-password-page 
router.get('/verifyPassword',userController.getVerifyPassword)

router.post('/verifypwd',userController.postVerifyPassword)

//password-setting-page
router.get('/passwordSetting',userController.getpasswordSetting)

router.post('/pwdSetting',userController.postPasswordSetting)



// Home-page
router.get('/home',userController.getHome)

router.get('/searchProduct',userController.getSearchPdt)



// shop-page

router.get('/shop-page',userController.getShopPage)

router.get('/categoryList/:name',userController.getCategoryList)

router.get('/sortProduct/:sort',userController.getSortProduct)

router.get('/search-product',userController.getSearchProduct)

router.get('/brandList/:name',userController.getBrandList)



//product-Details
router.get('/productDetails/:id',userController.getProductDetails)



router.use(verifyUser)
router.use(banUserAccount)


//wishlist
router.get('/addToWishlist/:id',userController.getAddWishlist)

router.get('/wishlist',userController.getWishlist)

router.get('/addCartDeleteWl/:id',userController.getAddCartDeleteWl)

router.get('/deleteWishlist/:id',userController.getDeleteWishlist)

//cart

//Add to cart

router.get('/addToCart/:id',userController.getAddCart)

router.get('/cart',userController.getCart)

router.get('/cartProductDelete/:id',userController.getDeleteCart)

router.get('/quantityInc/:id',userController.getQtyInc)

router.get('/quantityDec/:id',userController.getQtyDec)

//checkOut-page
router.get('/checkout/',userController.getCheckout)

router.get('/addAddress',userController.getAddAdress)

router.get('/editAddress',userController.getCheckoutAddress)

router.post('/addedAddress',userController.postAddedAddress)


router.get('/userProfile',userController.getUserProfile)

router.get('/selectAddress/:id',userController.getSelectedAddress)

router.get('/deleteAddress/:id',userController.getDeletedAddress)

router.post('/redeemCoupon',userController.getRedeemCoupon)

router.post('/postCheckout',userController.postCheckoutOrder)

router.get('/orderSuccess',userController.getOrderSuccess)

router.post('/verifyPayment',userController.getVerifyPayment)

router.get('/editUser',userController.getEditUser)

router.post('/updateUser',userController.postupdateUser)

router.get('/editAddressDetails/:id',userController.getEditAddressDetails)

router.post('/updateAddress/:id',userController.postUpdateAddress)

router.get('/orderHistory',userController.getOrderHistory)


//order-details
router.get('/orderedProduct/:id',userController.getOrderedProduct)

router.get('/invoice/:id',userController.getInvoice)

router.post('/cancelOrder',userController.postCancelOrder)

router.get('/returnOrder/:id',userController.getReturnOrder)

router.get('/orderList/:name',userController.getOrderList)

router.get('/logout',userController.getLogout)

module.exports=router;