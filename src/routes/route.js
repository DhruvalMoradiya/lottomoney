const express = require('express');
const router = express.Router();

const {createUser, userLogin, forgotPassword,forgotPasswordEnterOldPassword,updateUserProfile,getUserData} = require("../controllers/userController")
const {createAdminUser, adminUserLogin, adminChangePassword, updateAdminProfile} = require("../controllers/adminUserController")
const {authentication ,autherization,authenticationAdmin,autherizationAdmin}= require('../middleware/auth')
const { addPackageList,getPackage,packageDelete,updatePackage} = require("../controllers/masterPackagesController")
const { feesAdd,getFees,updateFees,searchFeesPacakageNamewise,feesDelete } = require("../controllers/masterFeesController")
const { addAboutUs,getAboutUs } = require("../controllers/configurationAboutController")
const { addContactUs,getContactUs } = require("../controllers/configurationContactController")
const { addBasicInfo,getBasicInfo } = require("../controllers/appDetailsBasicInfoController")
const { addNotification,getNotification } = require("../controllers/appDetailsNotificationController")
const { addWalletData,getWalletData } = require("../controllers/appDetailsWalletController")
const { addOtherData, getOtherData } = require("../controllers/appDetailsOtherController")
const { addAppUpdateData,getAppUpdateData } = require("../controllers/appUpdateController")
const { addPrivacyPolicy,getPrivacyPolicy } = require("../controllers/configurationPrivacyPolicyController")
const { addTermsAndCondition,getTermsAndCondition } = require("../controllers/configurationTermsAndConditionsController")
const { addContestData,getContestData,searchContest,updateContest,contestDelete} = require("../controllers/contestController")
const {addDummyUserData,getDummyUserData,searchDummyUser,updateDummyUser,dummyUserDelete} = require("../controllers/dummyUserController")
const {addSendNotificationData,getSendNotificationData} = require("../controllers/sendNotificationController")
const {addModeofPayment,getModeofPaymentDetail} = require("../controllers/appDetailsPaymentGatewayController")
const {addRazorPay,getRazorPay} = require("../controllers/paymentGatewayRazorPayController")
const {addPaytmData,getPaytmData} = require("../controllers/paymentGatewayPaytmController")
const {addUpi,getUpi} = require("../controllers/paymentGatewayUpiController")
const {addWithdrawRequestData,getWithdrawRequestData,searchWithdrawRequest} = require("../controllers/withdrawRequestController")

router.post("/register",createUser)
router.post("/login", userLogin)
router.get("/userdataget",authenticationAdmin,getUserData)

router.put("/user/:userId/profile",authentication,autherization,updateUserProfile)
router.put("/forgotpassword",forgotPassword)
router.put("/changepassword",forgotPasswordEnterOldPassword)

//Admin

router.post("/register-admin",createAdminUser)
router.post("/login-admin", adminUserLogin)
router.put("/admin/:adminId/profile",authenticationAdmin,autherizationAdmin,updateAdminProfile)
router.put("/admin/:adminId/resetpassword",authenticationAdmin,autherizationAdmin,adminChangePassword)

 router.post("/packagenameadd",authenticationAdmin,addPackageList)
 router.get("/packagenameget",authenticationAdmin,getPackage)
  //?page=1&pageSize=10&sortOrder=desc
//  router.get("/searchpackage",authenticationAdmin,searchPackage)
 router.delete("/package/:packageId",authenticationAdmin,packageDelete)
 router.put("/package/:packageId",authenticationAdmin,updatePackage)

 router.post("/feesdetailsadd/:packageId",authenticationAdmin,feesAdd)
 router.get("/feesdetailsget",authenticationAdmin,getFees)
  //?page=1&pageSize=10&sortField=noOfTicket&sortOrder=asc
 //router.get("/searchfees",authenticationAdmin,searchFeesPacakageNamewise)
 //router.get("/searchfeesnu/:key",authenticationAdmin,searchFeesPackage)
 router.delete("/fees/:feeId",authenticationAdmin,feesDelete)
 router.put("/fees",authenticationAdmin,updateFees)
 
 router.post("/aboutusadd",authenticationAdmin,addAboutUs)
 router.get("/aboutusget",authenticationAdmin,getAboutUs)

 router.post("/contactusadd",authenticationAdmin,addContactUs)
 router.get("/contactusget",authenticationAdmin,getContactUs)

 router.post("/basicinfoadd",authenticationAdmin,addBasicInfo)
 router.get("/basicinfoget",authenticationAdmin,getBasicInfo)

 router.post("/notificationadd",authenticationAdmin,addNotification)
 router.get("/notificationget",authenticationAdmin,getNotification)

 router.post("/walletdataadd",authenticationAdmin,addWalletData)
 router.get("/walletdataget",authenticationAdmin,getWalletData)

 router.post("/modeofpaymentadd",authenticationAdmin,addModeofPayment)
 router.get("/modeofpaymentget",authenticationAdmin,getModeofPaymentDetail)

 router.post("/razorpayadd",authenticationAdmin,addRazorPay)
 router.get("/razorpayget",authenticationAdmin,getRazorPay)

 router.post("/paytmadd",authenticationAdmin,addPaytmData)
 router.get("/paytmget",authenticationAdmin,getPaytmData)

 router.post("/upiadd",authenticationAdmin,addUpi)
 router.get("/upiget",authenticationAdmin,getUpi)

 router.post("/otherdataadd",authenticationAdmin,addOtherData)
 router.get("/otherdataget",authenticationAdmin,getOtherData)

 router.post("/appupdatedataadd",authenticationAdmin,addAppUpdateData)
 router.get("/appupdatedataget",authenticationAdmin,getAppUpdateData)

 router.post("/privacypolicyadd",authenticationAdmin,addPrivacyPolicy)
 router.get("/privacypolicyget",authenticationAdmin,getPrivacyPolicy)

 router.post("/termsandconditionadd",authenticationAdmin,addTermsAndCondition)
 router.get("/termsandconditionget",authenticationAdmin,getTermsAndCondition)

 router.post("/contestdataadd",authenticationAdmin,addContestData)
 router.get("/contestdataget",getContestData)
 router.get("/searchcontest",authenticationAdmin,searchContest)
 router.put("/contestupdate/:contestId",authenticationAdmin,updateContest)
 router.delete("/contestdatadelete/:contestId",authenticationAdmin,contestDelete)


 router.post("/dummyuseradd",authenticationAdmin,addDummyUserData)
 router.get("/dummyuserget",authenticationAdmin,getDummyUserData)
 router.get("/searchdummyuser/:key",authenticationAdmin,searchDummyUser)
 router.put("/dummyuserupdate/:userId",authenticationAdmin,updateDummyUser)
 router.delete("/dummyuserdelete/:userId",authenticationAdmin,dummyUserDelete)

 router.post("/sendwithdrawrequest",authentication,addWithdrawRequestData)
 router.get("/withdrawrequest",authenticationAdmin,getWithdrawRequestData)
 router.get("/searchwithdrawrequest",authenticationAdmin,searchWithdrawRequest)


 router.post("/sendnotificationadd",authenticationAdmin,addSendNotificationData)
 router.get("/sendnotificationget",authenticationAdmin,getSendNotificationData)

 // ?page=1&pageSize=20
 
module.exports = router;