const dummyUserModel = require("../models/dummyUserModel");
const {uploadFile} = require("../aws/fileUpload");
const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require("mongoose");

const isValid = function (x) {
  if (typeof x === "undefined" || x === null) return false;
  if (typeof x === "string" && x.trim().length === 0) return false;
  return true;
};
const isValidBody = function (x) {
  return Object.keys(x).length > 0;
};


const addDummyUserData = async function (req, res) {
  try {
      let body = req.body;
      let { firstName, lastName, userName } = body;

      if (!isValidBody(body)) {
          return res.status(400).send({ status: false, message: "Body cannot be blank" });
      }

      if (!isValid(firstName)) {
          return res.status(400).send({ status: false, message: "firstName is required" });
      }

      if (!isValid(lastName)) {
          return res.status(400).send({ status: false, message: "lastName is required" });
      }

      if (!isValid(userName)) {
        return res.status(400).send({ status: false, message: "userName is required" });
    }

      // Create new record
      let newDummyUserData = {
        firstName, 
        lastName, 
        userName
      };

      let DummyUserData = await dummyUserModel.create(newDummyUserData);
      return res.status(201).send({ status: true, message: "DummyUser added successfully", DummyUserData });
  } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Server-side Errors. Please try again later", error: error.message });
  }
};


const getDummyUserData = async function (req, res) {
    try {
        let page = req.query.page || 1;
        let pageSize = req.query.pageSize || 10;
        let sortFields = req.query.sortFields || ['firstName']; // Default sort field is 'firstName'
        let sortOrder = req.query.sortOrder || 'asc';
        const searchKeyword = req.query.search || ''; // Default to an empty string if 'search' parameter is not provided

        if (!Array.isArray(sortFields)) {
            sortFields = [sortFields];
        }

        const query = {
            isDeleted: false,
            $or: [
                { firstName: { "$regex": searchKeyword, "$options": "i" } },
                { lastName: { "$regex": searchKeyword, "$options": "i" } },
                { userName: { "$regex": searchKeyword, "$options": "i" } }
            ]
        };

        const dummyUserData = await dummyUserModel
            .find(query)
            .select({ firstName: 1, lastName: 1, userName: 1, _id: 1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        // Always return a 200 status, whether data is found or not
        return res.status(200).send({
            status: true,
            message: "DummyUser",
            dummyUserData: dummyUserData.sort((a, b) => {
                for (const field of sortFields) {
                    const valueA = a[field];
                    const valueB = b[field];

                    // Default sorting for non-numeric fields
                    const compareResult = sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                    if (compareResult !== 0) {
                        return compareResult;
                    }
                }
                return 0;
            }),
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};


const searchDummyUser = async function (req, res) {
    try {
        let page = req.query.page || 1;
        let pageSize = req.query.pageSize || 10;

        const key = req.params.key;

        const query = {
            $or: [
                { firstName: { "$regex": key, "$options": "i" } },
                { lastName: { "$regex": key, "$options": "i" } },
                { userName: { "$regex": key, "$options": "i" } }
               
            ]
        };

        const recordData = await dummyUserModel.find(query)
            .select({
                firstName: 1,
                lastName: 1,
                userName: 1,
                _id: 1
            })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        if (recordData.length > 0) {
            res.status(200).send({ success: true, msg: "Contest Record details", data: recordData });
        } else {
            res.status(404).send({ success: false, msg: "Record not found" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};


const updateDummyUser = async function (req, res) {
    try {
      let body = req.body
      let userId = req.params.userId
      
     // if (!isValidBody(body)) return res.status(400).send({ status: false, message: "Body is empty to update " })
       if (!isValidBody(body) && !req.files) return res.status(400).send({ status: false, message: "Body is empty to update " })
  
      let {firstName,lastName,userName} = body
  
      if ("firstName" in body) {
        if (!isValid(firstName)) return res.status(400).send({ status: false, message: "firstName required" })
      }
      if ("lastName" in body) {
        if (!isValid(lastName)) return res.status(400).send({ status: false, message: "lastName required" })
      }
      if ("userName" in body) {
        if (!isValid(userName)) return res.status(400).send({ status: false, message: "userName required" })
      }
  
      let result = {firstName,lastName,userName}   
  
      let update = await dummyUserModel.findOneAndUpdate({ _id:userId }, result, { new: true })
  
      return res.status(200).send({ status: true, message: " contest  Updated successfully", data: update })
  
    } catch (err) {
      console.log(err)
      return res.status(500).send({ status: false, message: "server side errors", error: err.message })
    }
  }


const dummyUserDelete = async function (req, res) {
    try {
        let userId = req.params.userId;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).send({ status: false, message: "user ID is invalid" });
        }

        let deletedDummyUser = await dummyUserModel.findOneAndDelete({ _id:userId, isDeleted: false });

        if (!deletedDummyUser) {
            return res.status(404).send({ status: false, message: "DummyUser does not exist" });
        }

        return res.status(200).send({ status: true, message: "DummyUser deleted successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

  module.exports = {addDummyUserData,getDummyUserData,searchDummyUser,updateDummyUser,dummyUserDelete}