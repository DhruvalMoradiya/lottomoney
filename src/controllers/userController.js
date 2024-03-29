const userModel = require("../models/userModel")
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


const createUser = async function (req, res) {
  try {
      let body = req.body;
      let { mobile, email, password, referral } = body;

      if (!isValidBody(body)) return res.status(400).send({ status: false, message: "Body cannot be blank" });

      if (!isValid(mobile)) return res.status(400).send({ status: false, message: "Phone Number required" });
      if (!/^(\+91)?0?[6-9]\d{9}$/.test(mobile)) return res.status(400).send({ status: false, message: "Mobile Number invalid. Should be 10 digits" });
      
      if (!isValid(email)) return res.status(400).send({ status: false, message: "Email is required" });
      if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) return res.status(400).send({ status: false, message: "Valid email is required" });

      if (!isValid(password)) return res.status(400).send({ status: false, message: "Password is required" });
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,15}$/.test(password)) return res.status(400).send({ status: false, message: "Please provide a password that is 8-15 characters long and includes at least one capital letter, one small letter, one number, and one special character." });

      let userDetails = await userModel.findOne({ $or: [{ email: email }, { mobile: mobile }] });

      if (userDetails) {
          if (userDetails.email == email) {
              return res.status(200).send({ status: false, message: `${email} email already exists` });
          } else {
              return res.status(200).send({ status: false, message: `${mobile} mobile already exists` });
          }
      }

      const lastUser = await userModel.findOne({}, {}, { sort: { 'customId': -1 } });
      let lastId = 0;

      // If lastUser exists, retrieve customId
      if (lastUser) {
          lastId = parseInt(lastUser.customId) || 0;
      }

      // Generate new customId
      const newId = lastId + 1;

      // Set customId in body
      body.customId = newId.toString(); // Convert to string

      const hashPassword = bcrypt.hashSync(password, 10);
      body["password"] = hashPassword;

      let usersData = await userModel.create(body);
      return res.status(201).send({ status: true, message: "User created successfully", usersData });
  } catch (error) {
      return res.status(500).send({ message: "Server side error. Please try again later", error: error.message });
  }
}


const userLogin = async function (req, res) {
  try {
    const credentials = req.body;
    if (!isValidBody(credentials)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide login credentials" });
    }

    const { mobile, password } = credentials;

    // Email validation
    if (!isValid(mobile)) {
      return res
        .status(400)
        .send({ status: false, message: "mobile is required" });
    }
    if (!/^(\+91)?0?[6-9]\d{9}$/.test(mobile)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid mobile Number" });
    }

    // Password Validation
    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });
    }

    // Check if user is present or not
    let user = await userModel.findOne({mobile});
    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "mobile is not correct" });
    }

    let passwordMatch = bcrypt.compareSync(password, user.password);

    if (passwordMatch === false) return res.status(401).send({status: false, message: "Password is not correct"});

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      "SECRET-OF-LOTTO",
      {
        // expiresIn: "60min"
      }
    );

    const { _id } = user;

    res.setHeader("x-api-key", token);
    res.status(200).send({
      status: true,
      message: "You are logged in",
      data: { token,userId:_id },
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};


const forgotPassword = async (req, res) => {
    try {
        const mobile = req.body.mobile;
        const newPassword = req.body.password;

        const user = await userModel.findOne({ mobile: mobile });

        if (user) {
            if (!isValid(newPassword)) {
                return res.status(400).send({ success: false, message: "Enter a valid password" });
            }

            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,15}$/.test(newPassword)) {
                return res.status(400).send({ success: false, message: "Password should be 8 - 15 characters and include special characters or numbers" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await userModel.findOneAndUpdate({ mobile: mobile }, { $set: { password: hashedPassword } }, { new: true });

            res.status(200).send({ success: true, message: "Your password has been updated" });
        } else {
            res.status(404).send({ success: false, message: "User not found" });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

const forgotPasswordEnterOldPassword = async (req, res) => {
  try {
    const userEmail = req.body.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword; // Change 'password' to 'newPassword'
    const confirmPassword = req.body.confirmPassword;

      const user = await userModel.findOne({ email: userEmail });

      if (user) {
          const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

          if (!isPasswordValid) {
              return res.status(400).send({ success: false, message: "Old password is not correct" });
          }

          // Simplified password validation

          if (!newPassword || newPassword.length < 8) {
              console.log("Password length check failed:", newPassword.length); // Log the actual length of the password
              return res.status(400).send({ success: false, message: "Password should be at least 8 characters long" });
          }
          
          if (newPassword !== confirmPassword) {
              return res.status(400).send({ success: false, message: "Your new password and confirmPassword do not match" });
          }

          const hashedPassword = await bcrypt.hash(newPassword, 10);
          await userModel.findOneAndUpdate({ email: userEmail }, { $set: { password: hashedPassword } }, { new: true });

          res.status(200).send({ success: true, message: "Your password has been updated" });
      } else {
          res.status(404).send({ success: false, message: "User not found" });
      }
  } catch (error) {
      res.status(500).send({ success: false, message: error.message });
  }
};

const updateUserProfile = async function (req, res) {
    try {
      let body = req.body
      let user = req.params.userId
      
     // if (!isValidBody(body)) return res.status(400).send({ status: false, message: "Body is empty to update " })
       if (!isValidBody(body) && !req.files) return res.status(400).send({ status: false, message: "Body is empty to update " })
  
  
      let { userName, dateOfBirth,gender, email, mobile,countryCode,totalCoin,wonCoin,bonusCoin,status,bankStatus} = body
  
      let files = req.files
      let profileImage;
      if (files && files.length > 0) {
        var uploadedFileURL = await uploadFile(files[0])
        profileImage = uploadedFileURL
      }
  
      
      if ("userName" in body) {
        if (!isValid(userName)) return res.status(400).send({ status: false, message: "Enter a valid userName" })
      }
  
      if ("dateOfBirth" in body) {
        if (!isValid(dateOfBirth)) return res.status(400).send({ status: false, message: "Enter a valid dateOfBirth" })
      }
  
      if ("gender" in body) {
        if (!isValid(gender)) return res.status(400).send({ status: false, message: "Enter a valid gender" })
      }
  
      let unique= []
        if("email" in body) {
        if (!isValid(email)) return res.status(400).send({ status: false, message: "Enter a valid email id" })
        if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) return res.status(400).send({ status: false, message: "Enter email in correct format" })
        unique.push({ email: email })
      }
  
      if ("mobile" in body) {
        if (!isValid(phone)) return res.status(400).send({ status: false, message: "Enter a valid mobile number" })
        if (!/^(\+91)?0?[6-9]\d{9}$/.test(mobile)) return res.status(400).send({ status: false, message: "Enter Indian valid mobile number" })
        unique.push({ mobile: mobile })
      }
  
      if(unique.length>0){
      let userDetails = await userModel.findOne({ $or: unique })
  
      if (userDetails) {
        if (userDetails.email == email) {
          return res.status(200).send({ status: false, message: `${email} email  already exist` })
        } else {
          return res.status(200).send({ status: false, message: `${mobile} mobile already exist` })
        }
      }
    }
      let result = { userName, dateOfBirth, gender, email, mobile, profileImage,countryCode,totalCoin,wonCoin,bonusCoin,status,bankStatus }   
  
      let update = await userModel.findOneAndUpdate({ _id:user }, result, { new: true })
  
      return res.status(200).send({ status: true, message: " User profile Updated successfully", data: update })
  
    } catch (err) {
      console.log(err)
      return res.status(500).send({ status: false, message: "server side errors", error: err.message })
    }
  }

  const getUserData = async function (req, res) {
    try {
        let page = req.query.page || 1;
        let pageSize = req.query.pageSize || 10;
        let sortFields = req.query.sortFields || ['customId']; // Default sort field is 'userName'
        let sortOrder = req.query.sortOrder || 'asc';
        const searchKeyword = req.query.search || '';

        if (!Array.isArray(sortFields)) {
            sortFields = [sortFields];
        }

        const numericFields = ['totalCoin', 'wonCoin', 'bonusCoin']; // Add other numeric fields as needed

        let query = { isDeleted: false };

        // Check if it's a search query
        if (searchKeyword) {
            const searchRegex = new RegExp(searchKeyword, 'i');

            query.$or = [
                { userName: searchRegex },
                { email: searchRegex },
                { mobile: searchRegex },
                { gender: searchRegex },
                { dateOfBirth: searchRegex },
                { totalCoin: { $regex: searchRegex } },
                { wonCoin: { $regex: searchRegex } },
                { bonusCoin: { $regex: searchRegex } },
                { status: { $regex: searchRegex } },
                { bankStatus: { $regex: searchRegex } },
                { customId: { $regex: searchRegex } },
            ];
        }

        // Count total documents matching the query
        const totalDocuments = await userModel.countDocuments(query);

        const userData = await userModel
            .find(query)
            .select({ userName: 1, email: 1, mobile: 1, gender: 1, dateOfBirth: 1, totalCoin: 1, wonCoin: 1, bonusCoin: 1, status: 1, bankStatus: 1,customId:1, _id: 1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        // Always return a 200 status, whether data is found or not
        return res.status(200).send({
          status: true,
          message: "userData",
          count: totalDocuments,
          userData: userData.sort((a, b) => {
              for (const field of sortFields) {
                  const valueA = a[field];
                  const valueB = b[field];
      
                  if (numericFields.includes(field)) {
                      // Convert to numeric values for numeric fields
                      const numericValueA = parseInt(valueA) || 0;
                      const numericValueB = parseInt(valueB) || 0;
                      if (numericValueA !== numericValueB) {
                          return sortOrder === 'asc' ? numericValueA - numericValueB : numericValueB - numericValueA;
                      }
                  } else {
                      // Default sorting for other fields
                      const compareResult = compareValues(valueA, valueB, sortOrder);
                      if (compareResult !== 0) {
                          return compareResult;
                      }
                  }
              }
              return 0;
          }),
      });
      
      function compareValues(valueA, valueB, sortOrder) {
          // Handle null or undefined values
          if (valueA == null && valueB == null) {
              return 0;
          } else if (valueA == null) {
              return sortOrder === 'asc' ? -1 : 1;
          } else if (valueB == null) {
              return sortOrder === 'asc' ? 1 : -1;
          }
      
          // Default sorting for other fields
          return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

const countTotalusers = async function (req, res) {
  try {
      const totalUserCount = await userModel.countDocuments();

      res.json({ success: true, message: 'Total User', count: totalUserCount });
  } catch (error) {
      console.error('Error counting contests:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};


module.exports = {createUser, userLogin, forgotPassword, forgotPasswordEnterOldPassword, updateUserProfile,getUserData,countTotalusers}
