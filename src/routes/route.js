const express = require('express');
const router = express.Router();

const {createUser, userLogin, forgotPassword,forgotPasswordEnterOldPassword,updateUserProfile,getUserData,countTotalusers} = require("../controllers/userController")
const {createAdminUser, adminUserLogin, adminChangePassword, updateAdminProfile} = require("../controllers/adminUserController")
const {authentication ,autherization,authenticationAdmin,autherizationAdmin}= require('../middleware/auth')
const { addPackageList,getPackage,packageDelete,updatePackage,countContesttype} = require("../controllers/masterPackagesController")
const { feesAdd,getFees,updateFees,feesDelete,calculateNetProfitMonthWise,getFeesByPackageId} = require("../controllers/masterFeesController")
const { addAboutUs,getAboutUs } = require("../controllers/configurationAboutController")
const { addContactUs,getContactUs } = require("../controllers/configurationContactController")
const { addBasicInfo,addFile,getBasicInfo } = require("../controllers/appDetailsBasicInfoController")
const { addNotification,getNotification } = require("../controllers/appDetailsNotificationController")
const { addWalletData,getWalletData } = require("../controllers/appDetailsWalletController")
const { addOtherData, getOtherData } = require("../controllers/appDetailsOtherController")
const { addAppUpdateData,getAppUpdateData } = require("../controllers/appUpdateController")
const { addPrivacyPolicy,getPrivacyPolicy } = require("../controllers/configurationPrivacyPolicyController")
const { addTermsAndCondition,getTermsAndCondition } = require("../controllers/configurationTermsAndConditionsController")
const { addContestData,getContestData,searchContest,updateContest,contestDelete,countAllContests,contestGetDetails,contestGetLiveDetails,
        contestGetUpcomingDetails,endContestDetails} = require("../controllers/contestController")
const {addDummyUserData,getDummyUserData,searchDummyUser,updateDummyUser,dummyUserDelete} = require("../controllers/dummyUserController")
const {addSendNotificationData,getSendNotificationData} = require("../controllers/sendNotificationController")
const {addModeofPayment,getModeofPaymentDetail} = require("../controllers/appDetailsPaymentGatewayController")
const {addPaymentData,getPaymentData} = require("../controllers/paymentGatewayAllController")
const {addWithdrawRequestData,getWithdrawRequestData,countWithdrawalStatus} = require("../controllers/withdrawRequestController")
const {createWinner,getWinners} = require("../controllers/userWinnerController")
const {createTicket,getMyTicket,getUserByUserId,updateWinnerForContestTickets} = require("../controllers/userTicketController")
const {createPrizePool,getPrizePool,updatePrizePool,prizePoolDelete,prizePoolDeleteAll} = require("../controllers/prizepoolMasterController")

router.post("/register",createUser)
router.post("/login", userLogin)
router.get("/userdataget",authenticationAdmin,getUserData)

router.put("/user/:userId/profile",authentication,autherization,updateUserProfile)
router.put("/forgotpassword",authentication,forgotPassword)
router.put("/changepassword",authentication,forgotPasswordEnterOldPassword)

//Admin

router.post("/register-admin",createAdminUser)
router.post("/login-admin", adminUserLogin)
router.put("/admin/:adminId/profile",authenticationAdmin,autherizationAdmin,updateAdminProfile)
router.put("/admin/:adminId/resetpassword",authenticationAdmin,autherizationAdmin,adminChangePassword)

//File uplod//

router.post("/file",authenticationAdmin,addFile)

 router.post("/packagenameadd",authenticationAdmin,addPackageList)
 router.get("/packagenameget",authenticationAdmin,getPackage)
  //?page=1&pageSize=10&sortOrder=desc
//  router.get("/searchpackage",authenticationAdmin,searchPackage)
 router.delete("/package/:packageId",authenticationAdmin,packageDelete)
 router.put("/package/:packageId",authenticationAdmin,updatePackage)

 router.post("/feesdetailsadd/:packageId",authenticationAdmin,feesAdd)
 router.get("/feesdetailsget",authenticationAdmin,getFees)
  //?page=1&pageSize=10&search=g&sortField=packageName&sortOrder=asc
 router.delete("/fees/:feeId",authenticationAdmin,feesDelete)
 router.put("/feesupdate/:feeId",authenticationAdmin,updateFees)
 router.get("/fees/:packageId",authenticationAdmin,getFeesByPackageId)

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

 router.post("/paymentadd",authenticationAdmin,addPaymentData)
 router.get("/paymentget",authenticationAdmin,getPaymentData)
//  router.get("/payment",getPayment)

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
 router.get("/countallcontests",authenticationAdmin,countAllContests)
 router.get("/contesttype",authenticationAdmin,countContesttype)
 router.get("/counttotaluser",authenticationAdmin,countTotalusers)
 router.get("/countwithdrawalstatus",authenticationAdmin,countWithdrawalStatus)
 router.get("/calculatenetprofitmonthwise",authenticationAdmin,calculateNetProfitMonthWise)
 router.get("/endcontest",authentication,endContestDetails)

 router.post("/dummyuseradd",authenticationAdmin,addDummyUserData)
 router.get("/dummyuserget",authenticationAdmin,getDummyUserData)
 router.get("/searchdummyuser/:key",authenticationAdmin,searchDummyUser)
 router.put("/dummyuserupdate/:userId",authenticationAdmin,updateDummyUser)
 router.delete("/dummyuserdelete/:userId",authenticationAdmin,dummyUserDelete) 

 router.post("/sendwithdrawrequest",authentication,addWithdrawRequestData)
 router.get("/withdrawrequest",authenticationAdmin,getWithdrawRequestData)

 router.post("/sendnotificationadd",authenticationAdmin,addSendNotificationData)
 router.get("/sendnotificationget",authenticationAdmin,getSendNotificationData)

 // ?page=1&pageSize=20

 router.post("/prizepooladd",authenticationAdmin,createPrizePool)
 router.get("/prizepoolget",authenticationAdmin,getPrizePool)
 router.put("/prizepoolupdate/:prizePoolId",authenticationAdmin,updatePrizePool)
 router.delete("/prizepooldelete/:prizePoolId",authenticationAdmin,prizePoolDelete)
 router.delete("/prizepooldeleteall",authenticationAdmin,prizePoolDeleteAll)  
 
 
// User//
router.get("/usercontest",authentication,contestGetDetails)
router.get("/usercontestlive",authentication,contestGetLiveDetails)
router.get("/usercontestupcoming",authentication,contestGetUpcomingDetails)

// router.post("/winner",authentication,createWinner)
// router.get("/winner/:userId",authentication,getWinners)

router.post("/myticket",authentication,createTicket)
router.get("/myticket/:userId",authentication,getMyTicket)
router.get("/winner/:userId",authentication,getUserByUserId)
router.put("/winner/:contestId",authentication,updateWinnerForContestTickets)

module.exports = router;