const packagesModel = require("../models/masterPackagesModel");
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

const addPackageList = async function (req, res) {
    try {
        let body = req.body;
        let { packageName } = body;

        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, message: "Body cannot be blank" });
        }

        if (!isValid(packageName)) {
            return res.status(400).send({ status: false, message: "packageName is required" });
        }

        let newPackagetData = { packageName };

        let packageData = await packagesModel.create(newPackagetData);
        return res.status(201).send({ status: true, message: "packageData created successfully", packageData });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message });
    }
}



const getPackage = async function (req, res) {
  try {
      let page = req.query.page || 1;
      let pageSize = req.query.pageSize || 10;
      const packageDetail = await packagesModel
          .find({ isDeleted: false })
          .select({
              packageName: 1,
              _id: 1
          })
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .exec();

      if (packageDetail.length === 0) {
          return res.status(404).send({ status: false, msg: "No package found" });
      }

      // Map the array of packageDetail to include both packageName and packageId
      const packageData = packageDetail.map(package => ({
          packageName: package.packageName,
          packageId: package._id
      }));

      return res.status(200).json({
          status: true,
          message: "packageName",
          package: packageData,
      });
  } catch (err) {
      res.status(500).json({ status: false, msg: err.message });
  }
};

const searchPackage = async function (req, res) {
    try {
        const searchKeyword = req.params.key;
        const keywordRegex = new RegExp(searchKeyword, 'i');

        const recordData = await packagesModel.find({
            $or: [
                { packageName: { $regex: keywordRegex } }
            ]
        }).select({
            packageName: 1,
            _id: 1
        });

        if (recordData.length > 0) {
            const filteredData = recordData.map(package => ({
                packageId: package._id,
                packageName: package.packageName,
            }));

            res.status(200).send({ success: true, msg: "package Record details", data: filteredData });
        } else {
            res.status(404).send({ success: true, msg: "Record not found" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const updatePackage = async function (req, res) {
    try {
      let body = req.body
      let packageId = req.params.packageId
      
     // if (!isValidBody(body)) return res.status(400).send({ status: false, message: "Body is empty to update " })
       if (!isValidBody(body) && !req.files) return res.status(400).send({ status: false, message: "Body is empty to update " })
  
  
      let {packageName} = body
  
      
      if ("packageName" in body) {
        if (!isValid(packageName)) return res.status(400).send({ status: false, message: "packageName required" })
      }
  
      let result = { packageName}   
  
      let update = await packagesModel.findOneAndUpdate({ _id:packageId }, result, { new: true })
  
      return res.status(200).send({ status: true, message: " package  Updated successfully", data: update })
  
    } catch (err) {
      console.log(err)
      return res.status(500).send({ status: false, message: "server side errors", error: err.message })
    }
  }

const packageDelete = async function (req, res) {
    try {
        let packageId = req.params.packageId;

        if (!ObjectId.isValid(packageId)) {
            return res.status(400).send({ status: false, message: "package ID is invalid" });
        }

        let deletedPackage = await packagesModel.findOneAndDelete({ _id:packageId, isDeleted: false });

        if (!deletedPackage) {
            return res.status(404).send({ status: false, message: "package does not exist" });
        }

        return res.status(200).send({ status: true, message: "package deleted successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = {addPackageList,getPackage,packageDelete,updatePackage,searchPackage}