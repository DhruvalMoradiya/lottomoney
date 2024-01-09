const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const userModel=require("../models/userModel")
const adminModel = require("../models/adminUserModel")
// const mongoose = require("mongoose");


////////////////////////////*Authentication*//////////////////////////////////////////////////////////////////
const authentication = (req, res, next) => {
    try {
      let token = req.headers['authorization'];
  
      if (!token) {
        return res.status(401).send({ status: false, message: "Authentication token is required in header" })
      }
  
      jwt.verify(token, "SECRET-OF-LOTTO", function (err, decoded) {
        if (err) {
          return res.status(403).send({ status: false, message: "Invalid authentication token in header" })
        } else {
          req.token = decoded; // Attach the entire decoded token
          next();
        }
      });
  
    } catch (err) {
      res.status(500).send({ status: false, message: err.message })
    }
  }
const autherization = async function (req, res, next) {
    try {
        let userId = req.params.userId;
        let token=req.headers[`Authorization`];
        if(!token) token=req.headers[`authorization`];
        if (!token) {
            return res.status(401).send({ status: false, message: "Authentication token is required in header" })
        }


        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Please enter a valid userId" });
        }

        let findUser = await userModel.findById(userId);
        if (!findUser) {
            return res.status(404).send({ status: false, message: "User not found" });
        }
        let decodedToken = jwt.verify(token, "SECRET-OF-LOTTO");
        if (findUser._id.toString() !== decodedToken.userId) {
            return res.status(403).send({ status: false, message: "User is not authorized to access this data" });
        }

        next();
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};

const authenticationAdmin = function (req, res, next) {
        try {
            let token=req.headers[`Authorization`];
            if(!token) token=req.headers[`authorization`];
            if (!token) {
                return res.status(401).send({ status: false, message: "Authentication token is required in header" })
            }
    
            jwt.verify(token, "SECRET-OF-LOTTO", function (err, decoded) {
                if (err) {
                    return res.status(403).send({ status: false, message: "Invalid authentication token in header" })
                }
                else {
                    req.token = decoded.adminId;
                    // console.log("Authentication successfull ✅")
                    next();
                }
            })
    
        } catch (err) {
            res.status(500).send({ status: false, message: err.message })
        }
    }
    const autherizationAdmin = async function (req, res, next) {
        try {
            let adminId = req.params.adminId;
            let token=req.headers[`Authorization`];
            if(!token) token=req.headers[`authorization`];
            if (!token) {
                return res.status(401).send({ status: false, message: "Authentication token is required in header" })
            }
    
    
            if (!mongoose.isValidObjectId(adminId)) {
                return res.status(400).send({ status: false, message: "Please enter a valid adminId" });
            }
    
            let findAdmin = await adminModel.findById(adminId);
            if (!findAdmin) {
                return res.status(404).send({ status: false, message: "Admin not found" });
            }
            let decodedToken = jwt.verify(token, "SECRET-OF-LOTTO");
            if (findAdmin._id.toString() !== decodedToken.adminId) {
                return res.status(403).send({ status: false, message: "User is not authorized to access this data" });
            }
    
            next();
        } catch (err) {
            res.status(500).send({ status: false, message: err.message });
        }
    };
module.exports = { authentication ,autherization,authenticationAdmin,autherizationAdmin}