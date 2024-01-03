const basicInfoModel = require("../models/appDetailsBasicInfoModel");
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


const addBasicInfo = async function (req, res) {
  try {
      let body = req.body;
      let { appName, appURL } = body;

      if (!isValidBody(body)) {
          return res.status(400).send({ status: false, message: "Body cannot be blank" });
      }

      if (!isValid(appName)) {
          return res.status(400).send({ status: false, message: "appName is required" });
      }

      if (!isValid(appURL)) {
          return res.status(400).send({ status: false, message: "appURL is required" });
      }

      let files = req.files;
      let logo = [];
      let favicon = [];

      if (files) {
          for (let i = 0; i < files.length; i++) {
              let file = files[i];

              if (isSupportedImageFile(file)) {
                  if (file.fieldname === "logo") {
                      let uploadedFileURL = await uploadFile(file);
                      logo.push(uploadedFileURL);
                  } else if (file.fieldname === "favicon") {
                      let uploadedFileURL = await uploadFile(file);
                      favicon.push(uploadedFileURL);
                  }
              } else {
                  return res.status(400).send({ status: false, message: "Unsupported file type" });
              }
          }
      }

      // Check if a record already exists
      let existingRecord = await basicInfoModel.findOne({ appName });

      if (existingRecord) {
          // Update existing record
          existingRecord.appURL = appURL;
          existingRecord.logo = logo;
          existingRecord.favicon = favicon;
          await existingRecord.save();
          return res.status(200).send({ status: true, message: "basicInfo updated successfully", basicInfoData: existingRecord });
      } else {
          // Create new record
          let newBasicInfoData = {
              appName,
              appURL,
              logo,
              favicon,
          };

          let basicInfoData = await basicInfoModel.create(newBasicInfoData);
          return res.status(201).send({ status: true, message: "basicInfo added successfully", basicInfoData });
      }
  } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Server-side Errors. Please try again later", error: error.message });
  }
};


  function isSupportedImageFile(file) {
    const supportedExtensions = ["jpg", "jpeg", "png"];
    const fileExtension = file.originalname.split(".").pop();
    return supportedExtensions.includes(fileExtension.toLowerCase());
  }
  


  const getBasicInfo = async function (req, res) {
    try {
        const basicInfoData = await basicInfoModel
            .findOne({ isDeleted: false })
            .select({ appName: 1, logo: 1, favicon: 1, appURL: 1, _id: 0 })
            .sort({ createdAt: -1 });

        if (!basicInfoData) {
            return res.status(404).send({ status: false, msg: "No basicInfo found" });
        }

        const transBasicInfo = {
            appName: basicInfoData.appName,
            logo: basicInfoData.logo.length > 0 ? basicInfoData.favicon[0] : null,
            favicon: basicInfoData.favicon.length > 0 ? basicInfoData.favicon[0] : null,
            appURL: basicInfoData.appURL
        };

        return res.status(200).send({
            status: true,
            message: "basicInfo",
            transBasicInfo,
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

  module.exports = {addBasicInfo,getBasicInfo}