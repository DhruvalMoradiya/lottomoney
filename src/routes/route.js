const express = require('express');
const router = express.Router();

const {createUser, userLogin, forgotPassword,forgotPasswordEnterOldPassword,updateUserProfile,getUserData} = require("../controllers/userController")
const {createAdminUser, adminUserLogin, adminChangePassword, updateAdminProfile} = require("../controllers/adminUserController")
const {authentication ,autherization,authenticationAdmin,autherizationAdmin}= require('../middleware/auth')
const { addPackageList,getPackage} = require("../controllers/masterPackagesController")
const { feesAdd,getFees } = require("../controllers/masterFeesController")
const { addAboutUs,getAboutUs } = require("../controllers/configurationAboutController")
const { addContactUs,getContactUs } = require("../controllers/configurationContactController")
const { addBasicInfo,getBasicInfo } = require("../controllers/appDetailsBasicInfoController")
const { addNotification,getNotification } = require("../controllers/appDetailsNotificationController")
const { addWalletData,getWalletData } = require("../controllers/appDetailsWalletController")
const { addOtherData, getOtherData } = require("../controllers/appDetailsOtherController")
const { addAppUpdateData,getAppUpdateData } = require("../controllers/appUpdateController")
const { addPrivacyPolicy,getPrivacyPolicy } = require("../controllers/configurationPrivacyPolicyController")
const { addTermsAndCondition,getTermsAndCondition } = require("../controllers/configurationTermsAndConditionsController")
const { addContestData,getContestData,contestDelete} = require("../controllers/contestController")
const {addDummyUserData,getDummyUserData,dummyUserDelete} = require("../controllers/dummyUserController")
const {addSendNotificationData,getSendNotificationData} = require("../controllers/sendNotificationController")
const {addModeofPayment,getModeofPaymentDetail} = require("../controllers/appDetailsPaymentGatewayController")
const {addRazorPay,getRazorPay} = require("../controllers/paymentGatewayRazorPayController")
const {addPaytmData,getPaytmData} = require("../controllers/paymentGatewayPaytmController")
const {addUpi,getUpi} = require("../controllers/paymentGatewayUpiController")

router.post("/register",createUser)
router.post("/login", userLogin)
router.get("/userdataget",getUserData)

router.put("/user/:userId/profile",authentication,autherization,updateUserProfile)
router.put("/forgotpassword",forgotPassword)
router.put("/changepassword",forgotPasswordEnterOldPassword)

//Admin

router.post("/register-admin",createAdminUser)
router.post("/login-admin", adminUserLogin)
router.put("/admin/:adminId/profile",authenticationAdmin,autherizationAdmin,updateAdminProfile)
router.put("/admin/:adminId/resetpassword",authenticationAdmin,autherizationAdmin,adminChangePassword)

 router.post("/packagenameadd",addPackageList)
 router.get("/packagenameget",getPackage)

 router.post("/feesdetailsadd/:packageId",feesAdd)
 router.get("/feesdetailsget",getFees)
 
 router.post("/aboutusadd",addAboutUs)
 router.get("/aboutusget",getAboutUs)

 router.post("/contactusadd",addContactUs)
 router.get("/contactusget",getContactUs)

 router.post("/basicinfoadd",addBasicInfo)
 router.get("/basicinfoget",getBasicInfo)

 router.post("/notificationadd",addNotification)
 router.get("/notificationget",getNotification)

 router.post("/walletdataadd",addWalletData)
 router.get("/walletdataget",getWalletData)

 router.post("/modeofpaymentadd",addModeofPayment)
 router.get("/modeofpaymentget",getModeofPaymentDetail)

 router.post("/razorpayadd",addRazorPay)
 router.get("/razorpayget",getRazorPay)

 router.post("/paytmadd",addPaytmData)
 router.get("/paytmget",getPaytmData)

 router.post("/upiadd",addUpi)
 router.get("/upiget",getUpi)

 router.post("/otherdataadd",addOtherData)
 router.get("/otherdataget",getOtherData)

 router.post("/appupdatedataadd",addAppUpdateData)
 router.get("/appupdatedataget",getAppUpdateData)

 router.post("/privacypolicyadd",addPrivacyPolicy)
 router.get("/privacypolicyget",getPrivacyPolicy)

 router.post("/termsandconditionadd",addTermsAndCondition)
 router.get("/termsandconditionget",getTermsAndCondition)

 router.post("/contestdataadd",addContestData)
 router.get("/contestdataget",getContestData)
 router.delete("/contestdatadelete/:contestId",contestDelete)

 router.post("/dummyuseradd",addDummyUserData)
 router.get("/dummyuserget",getDummyUserData)
 router.delete("/dummyuserdelete/:dummyUserId",dummyUserDelete)

 router.post("/sendnotificationadd",addSendNotificationData)
 router.get("/sendnotificationget",getSendNotificationData)

 // ?page=1&pageSize=20
 
module.exports = router;