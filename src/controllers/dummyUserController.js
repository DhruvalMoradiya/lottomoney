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
        let pageSize = req.query.pageSize || 10; // Default page size is 10, you can customize it

        const dummyUserData = await dummyUserModel
            .find({ isDeleted: false })
            .select({ firstName: 1, lastName: 1, userName: 1,_id: 0 })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        if (!dummyUserData || dummyUserData.length === 0) {
            return res.status(404).send({ status: false, msg: "No DummyUser Data found" });
        }

        return res.status(200).send({
            status: true,
            message: "DummyUser",
            dummyUserData,
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};


const dummyUserDelete = async function (req, res) {
    try {
        let dummyUserId = req.params.dummyUserId;

        if (!ObjectId.isValid(dummyUserId)) {
            return res.status(400).send({ status: false, message: "DummyUser ID is invalid" });
        }

        let deletedDummyUser = await dummyUserModel.findOneAndDelete({ _id:dummyUserId, isDeleted: false });

        if (!deletedDummyUser) {
            return res.status(404).send({ status: false, message: "Contest does not exist" });
        }

        return res.status(200).send({ status: true, message: "DummyUser deleted successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

  module.exports = {addDummyUserData,getDummyUserData,dummyUserDelete}