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
      const packageDetail = await packagesModel
          .find({ isDeleted: false })
          .select({
              packageName: 1,
              _id: 1
          })
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

module.exports = {addPackageList,getPackage}