const express = require('express');
const router = express.Router();

const {createUser, userLogin, forgotPassword, forgotPasswordEnterOldPassword, updateUserProfile} = require("../controllers/userController")
const {authentication ,autherization}= require('../middleware/auth')
const { addPackageList,getPackage} = require("../controllers/masterPackagesController")
const { feesAdd,getFees } = require("../controllers/masterFeesController")

router.post("/register",createUser)
router.post("/login", userLogin)

router.put("/user/:userId/profile",authentication,autherization,updateUserProfile)
router.put("/forgotPassword",forgotPassword)
router.put("/resetPassword",forgotPasswordEnterOldPassword)

 router.post("/packagenameadd",addPackageList)
 router.get("/packagenameget",getPackage)

 router.post("/feesdetailsadd/:packageId",feesAdd)
 router.get("/feesdetailsget",getFees)

// router.post("/playlistadd",addPlayList)
// router.get("/playlistget",getPlayList)

// router.post("/playlistsongadd/:playListId",playlistAddSong)
// router.get("/getplaylistsong/:playListId",getPlayListSong)

// router.post("/indiasbestmainplaylistadd",addIndiasBestMainPlayList)
// router.get("/indiasbestmainplaylistget",getIndiasBestMainPlayList)

// router.post("/indiasbestplaylistadd/:indiasBestMainPlayListId",addIndiasBestPlayList)
// router.get("/indiasbestplaylistget/:indiasBestMainPlayListId",getIndiasBestPlayList)

// router.post("/indiasbestplaylistsongadd/:indiasBestSongPlayListId",indiasBestPlaylistAddSong)
// router.get("/indiasbestgetplaylistsong/:indiasBestSongPlayListId",getIndiasBestPlayListSong)

module.exports = router;