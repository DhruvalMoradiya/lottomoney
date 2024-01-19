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
        let { appName, appURL, logoURL, faviconURL } = body;

        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, message: "Body cannot be blank" });
        }

        if (!isValid(appName)) {
            return res.status(400).send({ status: false, message: "appName is required" });
        }

        if (!isValid(appURL)) {
            return res.status(400).send({ status: false, message: "appURL is required" });
        }

        // Validate logoURL and faviconURL if needed

        // Check if a record already exists
        let existingRecord = await basicInfoModel.findOne({ appName });

        if (existingRecord) {
            // Update existing record
            existingRecord.appURL = appURL;
            existingRecord.logoURL = logoURL;  // Assuming logoURL is a string
            existingRecord.faviconURL = faviconURL;  // Assuming faviconURL is a string
            await existingRecord.save();

            // Sending the existingRecord object directly in the response
            return res.status(200).send({ status: true, message: "basicInfo updated successfully", basicInfoData: existingRecord });
        } else {
            // Create new record
            let newBasicInfoData = {
                appName,
                appURL,
                logoURL,  // Assuming logoURL is a string
                faviconURL,  // Assuming faviconURL is a string
            };

            let basicInfoData = await basicInfoModel.create(newBasicInfoData);

            // Sending the basicInfoData object directly in the response
            return res.status(201).send({ status: true, message: "basicInfo added successfully", basicInfoData });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server-side Errors. Please try again later", error: error.message });
    }
};
  
const addFile = async function (req, res) {
    try {
        let files = req.files;

        if (files.length !== 1) {
            return res.status(400).send({ message: "Exactly one image file is required" });
        }

        let file = files[0];

        if (!isSupportedImageFile(file)) {
            return res.status(400).send({ status: false, message: "Only support jpg, jpeg, png file" });
        }

        let uploadedFileURL = await uploadFile(file, 'logos');

        return res.status(200).send({
            status: true,
            url: uploadedFileURL,
        });
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
            .select({ appName: 1, logoURL: 1, faviconURL: 1, appURL: 1, _id: 0 })
            .sort({ createdAt: -1 });

        if (!basicInfoData) {
            return res.status(404).send({ status: false, msg: "No basicInfo found" });
        }

        const transBasicInfo = {
            appName: basicInfoData.appName,
            logoURL: basicInfoData.logoURL,
            faviconURL: basicInfoData.faviconURL,
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

  module.exports = {addBasicInfo,addFile,getBasicInfo}