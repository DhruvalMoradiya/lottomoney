const express = require('express');
const router = express.Router();

const {createUser, userLogin, forgotPassword, forgotPasswordEnterOldPassword, updateUserProfile} = require("../controllers/userController")
const {authentication ,autherization}= require('../middleware/auth')
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

router.post("/register",createUser)
router.post("/login", userLogin)

router.put("/user/:userId/profile",authentication,autherization,updateUserProfile)
router.put("/forgotPassword",forgotPassword)
router.put("/resetPassword",forgotPasswordEnterOldPassword)

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

 router.post("/otherdataadd",addOtherData)
 router.get("/otherdataget",getOtherData)

 router.post("/appupdatedataadd",addAppUpdateData)
 router.get("/appupdatedataget",getAppUpdateData)

 router.post("/privacypolicyadd",addPrivacyPolicy)
 router.get("/privacypolicyget",getPrivacyPolicy)

 router.post("/termsandconditionadd",addTermsAndCondition)
 router.get("/termsandconditionget",getTermsAndCondition)


 
module.exports = router;