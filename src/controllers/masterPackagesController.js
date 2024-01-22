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
        let sortOrder = req.query.sortOrder || 'asc';
        const searchKeyword = req.query.search;

        // Validate sortOrder to ensure it's either 'asc' or 'desc'
        sortOrder = sortOrder.toLowerCase() === 'desc' ? -1 : 1;

        const query = {
            isDeleted: false,
            $or: [
                { packageName: { $regex: new RegExp(searchKeyword, 'i') } }
            ]
        };

        // Count total documents matching the query
        const totalDocuments = await packagesModel.countDocuments(query);

        // Find packages based on the query
        const packageDetail = await packagesModel
            .find(query)
            .select({
                packageName: 1,
                _id: 1
            })
            .sort({ packageName: sortOrder })  // Sort by packageName
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .exec();

        // Check if no packages are found
        if (packageDetail.length === 0) {
            // Return a 200 status with an empty array
            return res.status(200).json({
                status: true,
                message: "packageName",
                totalDocuments: totalDocuments,
                package: [],
            });
        }

        // Map the array of packageDetail to include both packageName and packageId
        const packageData = packageDetail.map(package => ({
            packageName: package.packageName,
            packageId: package._id
        }));

        return res.status(200).json({
            status: true,
            message: "packageName",
            totalDocuments: totalDocuments,
            package: packageData,
        });
    } catch (err) {
        res.status(500).json({ status: false, msg: err.message });
    }
};

const updatePackage = async function (req, res) {
    try {
      let body = req.body
      let packageId = req.params.packageId
      
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

const countContesttype = async function (req, res) {
    try {
        const totalContesttype = await packagesModel.countDocuments();

        res.json({ success: true, message: 'Contest type ', count: totalContesttype });
    } catch (error) {
        console.error('Error counting contests:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {addPackageList,getPackage,packageDelete,updatePackage,countContesttype}