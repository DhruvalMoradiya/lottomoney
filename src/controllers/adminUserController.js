const adminModel = require("../models/adminUserModel")
const { uploadFile } = require('../aws/fileUpload')
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const isvalidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValid = function(x) {
    if (typeof x === "undefined" || x === null) return false;
    if (typeof x === "string" && x.trim().length === 0) return false;
    return true;
};
const isValidBody = function(x) {
    return Object.keys(x).length > 0;
};


const createAdminUser = async function (req, res) {
    try {
        let body = req.body;
        let { userName, password } = body;

        if (!isValidBody(body)) return res.status(400).send({ status: false, message: "Body cannot be blank" });

        if (!isValid(userName)) {
            return res.status(400).send({ status: false, message: "userName is required" });
        }

        if (!isValid(password)) return res.status(400).send({ status: false, message: "Password is required" });
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,15}$/.test(password)) return res.status(400).send({ status: false, message: "Please provide Your password must be 8-15 characters long and include at least one capital letter, one small letter, one number, and one special character." });

        let userDetails = await adminModel.findOne({ userName: userName });

        if (userDetails && userDetails.userName == userName) {
            return res.status(400).send({ status: false, message: `${userName} userName already exists` });
        }

        const hashPassword = bcrypt.hashSync(password, 10);
        body["password"] = hashPassword;

        let usersData = await adminModel.create(body);
        return res.status(201).send({ status: true, message: "adminUser created successfully", usersData });
    } catch (error) {
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message });
    }
}


const adminUserLogin = async function (req, res) {
  try {
    const credentials = req.body;
    if (!isValidBody(credentials)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide login credentials" });
    }

    const { userName, password } = credentials;

    // Email validation
    if (!isValid(userName)) {
      return res
        .status(400)
        .send({ status: false, message: "userName is required" });
    }

    // Password Validation
    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });
    }

    // Check if user is present or not
    let user = await adminModel.findOne({ userName });

    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "userName is not correct" });
    }

    let passwordMatch = bcrypt.compareSync(password, user.password);

    if (passwordMatch === false)
      return res
        .status(401)
        .send({ status: false, message: "Password is not correct" });

    const token = jwt.sign(
      {
        adminId: user._id.toString(),
      },
      "SECRET-OF-LOTTO",
      {
        // expiresIn: "60min"
      }
    );

    const {
      _id,
      firstName,
      lastName,
      mobile,
      email,
      phone,
      avatarURL,
      userDesignation,
    } = user;

    res.setHeader("x-api-key", token);
    res.status(200).send({
      status: true,
      message: "You are logged in",
      data: {
        token,
        adminId: _id,
        firstName,
        lastName,
        mobile,
        userName: user.userName,
        email,
        phone,
        avatarURL,
        userDesignation,
      },
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const adminChangePassword = async (req, res) => {
    try {
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword; // Fix: Use the correct field name
        const verifyPassword = req.body.verifyPassword;

        // Check if decodedToken exists
        if (!req.token) {
            return res.status(401).send({ success: false, message: "Unauthorized access" });
        }

        const adminId = req.token;

        const data = await adminModel.findById(adminId);

        if (data) {
            const isPasswordMatch = await bcrypt.compare(currentPassword, data.password);

            if (!isPasswordMatch) {
                return res.status(400).send({ success: false, message: "Current password is not correct" });
            }

            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,15}$/.test(newPassword)) {
                return res.status(400).send({ success: false, message: "Password should be 8-15 characters and include special characters or numbers" });
            }

            if (newPassword !== verifyPassword) {
                return res.status(400).send({ success: false, message: "Your new password and verify password do not match" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await adminModel.findByIdAndUpdate(adminId, { $set: { password: hashedPassword } });

            res.status(200).send({ success: true, message: "Your password has been updated" });
        } else {
            res.status(404).send({ success: false, message: "Admin not found" });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};


const updateAdminProfile = async function (req, res) {
    try {
      let body = req.body
      let admin = req.params.adminId
      
     // if (!isValidBody(body)) return res.status(400).send({ status: false, message: "Body is empty to update " })
       if (!isValidBody(body) && !req.files) return res.status(400).send({ status: false, message: "Body is empty to update " })
  
  
      let { firstName, lastName, userName, userDesignation, email, phone,avatarURL} = body
  
      
      if ("firstName" in body) {
        if (!isValid(firstName)) return res.status(400).send({ status: false, message: "Enter a valid firstName" })
      }
  
      if ("lastName" in body) {
        if (!isValid(lastName)) return res.status(400).send({ status: false, message: "Enter a valid lastName" })
      }
  
      if ("userName" in body) {
        if (!isValid(userName)) return res.status(400).send({ status: false, message: "Enter a valid userName" })
      }
  
      if ("userDesignation" in body) {
        if (!isValid(userDesignation)) return res.status(400).send({ status: false, message: "Enter a valid userDesignation" })
      }

      if ("avatarURL" in body) {
        if (!isValid(avatarURL)) return res.status(400).send({ status: false, message: "Enter a valid avatarURL" })
      }
      // let unique= []
      //   if("email" in body) {
      //   if (!isValid(email)) return res.status(400).send({ status: false, message: "Enter a valid email id" })
      //   if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) return res.status(400).send({ status: false, message: "Enter email in correct format" })
      //   unique.push({ email: email })
      // }
  
      // if ("phone" in body) {
      //   if (!isValid(phone)) return res.status(400).send({ status: false, message: "Enter a valid phone number" })
      //   if (!/^(\+91)?0?[6-9]\d{9}$/.test(phone)) return res.status(400).send({ status: false, message: "Enter Indian valid phone number" })
      //   unique.push({ phone: phone })
      // }
  
      // if(unique.length>0){
      // let userDetails = await adminModel.findOne({ $or: unique })
  
    //   if (userDetails) {
    //     if (userDetails.email == email) {
    //       return res.status(400).send({ status: false, message: `${email} email  already exist` })
    //     } else {
    //       return res.status(400).send({ status: false, message: `${phone} phone already exist` })
    //     }
    //   }
    // }
    
      let result = { firstName, lastName, userName, userDesignation, email, phone ,avatarURL}   
  
      let update = await adminModel.findOneAndUpdate({ _id:admin }, result, { new: true })
  
      return res.status(200).send({ status: true, message: " admin profile Updated successfully", data: update })
  
    } catch (err) {
      console.log(err)
      return res.status(500).send({ status: false, message: "server side errors", error: err.message })
    }
  }


module.exports = {createAdminUser, adminUserLogin, adminChangePassword, updateAdminProfile}
