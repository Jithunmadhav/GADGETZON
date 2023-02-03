const { response } = require('express')
const express =require('express')
const user = require('../Services/user')
const userController=require('../controllers/userController')
const sentOTP = require('../helpers/sentOTP')
const adminController = require('../controllers/adminController')
const verifyUser = require('../middlewares/userSession')

const router=express.Router()



// user-login-page
router.get('/login',userController.getLogin)

router.post('/loginpost',userController.postLogin)

// router.get('/loginVerify',userController.getLoginVerify)

// router.post('/postLoginVerify',userController.postLoginVerify)
// user-signup-page
router.get('/signup',userController.getSignup)

router.post('/signUP',userController.postSignup)

// Signup-verification-page
router.get('/signupVerify',userController.getSignupVerify)

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


router.use(verifyUser)
// Home-page
router.get('/home',userController.getHome)



// shop-page

router.get('/shop-page',userController.getShopPage)

router.get('/categoryList/:name',userController.getCategoryList)

router.get('/sortProduct/:sort',userController.getSortProduct)

router.get('/search-product',userController.getSearchProduct)

router.get('/brandList/:name',userController.getBrandList)





//product-Details
router.get('/productDetails/:id',userController.getProductDetails)

//wishlist


router.get('/addToWishlist/:id',userController.getAddWishlist)

router.get('/wishlist',userController.getWishlist)

router.get('/deleteWishlist/:id',userController.getDeleteWishlist)

//cart

//Add to cart

router.get('/addToCart/:id',userController.getAddCart)

router.get('/cart',userController.getCart)

router.get('/cartProductDelete/:id',userController.getDeleteCart)




//manageProfile

router.get('/manageProfile',(req,res)=>{
    res.render('manageProfile')
})

//checkOut-page
router.get('/checkout',(req,res)=>{
    res.render('checkout')
})

//order-details
router.get('/ordered-product',(req,res)=>{
    res.render('orderedProduct')
})

module.exports=router;