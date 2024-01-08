const feesModel = require("../models/masterFeesModel");
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


const feesAdd = async function (req, res) {
    try {
      let body = req.body;
      let packageId = req.params.packageId;
      let {price,noOfWinner,noOfTicket} = body;
  
      if (!ObjectId.isValid(packageId)) {
        return res.status(400).send({ status: false, message: "packageId is invalid" });
      }
  
      if (!isValidBody(body)) {
        return res.status(400).send({ status: false, message: "Body cannot be blank" });
      }
  
      if (!isValid(price)) {
        return res.status(400).send({ status: false, message: "price is required" });
      }

      if (!isValid(noOfWinner)) {
        return res.status(400).send({ status: false, message: "No Of Winner is required" });
      }

      if (!isValid(noOfTicket)) {
        return res.status(400).send({ status: false, message: "No Of Ticket is required" });
      }
  
      if (!isValid(packageId)) {
        return res.status(400).send({ status: false, message: "packageId is required" });
      }
  
      let newfeesData = {
          packageId,
          price,
          noOfWinner,
          noOfTicket
      };
  
      let feesData = await feesModel.create(newfeesData);
  
      return res.status(201).send({ status: true, message: "feesData add successfully", feesData });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message });
    }
  };

  const getFees = async function (req, res) {
    try {

      let page = req.query.page || 1;
      let pageSize = req.query.pageSize || 10;

        const fees = await feesModel
            .find({ isDeleted: false })
            .select({ price: 1, noOfWinner: 1, noOfTicket: 1, packageId: 1, _id: 1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        if (fees.length === 0) {
            return res.status(404).send({ status: false, msg: "No data found" });
        }

        const transformedFees = await Promise.all(fees.map(async (fee) => {
            let packageName = "Unknown Package";

            if (fee.packageId) {
                const packageDetail = await packagesModel.findOne({ _id: fee.packageId, isDeleted: false });
                packageName = packageDetail ? packageDetail.packageName : "Unknown Package";
            }

            return {
                feeId:fee._id,
                packageName,
                price: fee.price,
                noOfWinner: fee.noOfWinner,
                noOfTicket: fee.noOfTicket,
            };
        }));

        return res.status(200).send({
            status: true,
            message: "feesData",
            feesList: transformedFees,
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

const searchFeesPacakageNamewise = async function (req, res) {
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

      const modifiedPackageDetail = [];

      for (const package of recordData) {
          const feesData = await feesModel
              .find({ packageId: package._id })
              .select({ price: 1, noOfWinner: 1, noOfTicket: 1 });

          const feesDataForCollection = feesData.map((fees) => ({
              price: fees.price,
              noOfWinner: fees.noOfWinner,
              noOfTicket: fees.noOfTicket,
          }));

          modifiedPackageDetail.push({
              _id: package._id,
              packageName: package.packageName,
              ...feesDataForCollection[0], // Spread the properties directly into the main object
          });
      }

      if (recordData.length > 0) {
          const filteredData = modifiedPackageDetail.filter(record =>
              record.packageName.toLowerCase().includes(searchKeyword.toLowerCase())
          );

          res.status(200).send({ success: true, msg: "Fees Record details", data: filteredData });
      } else {
          res.status(404).send({ success: true, msg: "Record not found" });
      }
  } catch (error) {
      res.status(400).send({ success: false, msg: error.message });
  }
};
const updateFees = async function (req, res) {
  try {
    let body = req.body
    let feeId = req.params.feeId
    
   // if (!isValidBody(body)) return res.status(400).send({ status: false, message: "Body is empty to update " })
     if (!isValidBody(body) && !req.files) return res.status(400).send({ status: false, message: "Body is empty to update " })


    let {price,noOfWinner,noOfTicket} = body

    
    if ("price" in body) {
      if (!isValid(price)) return res.status(400).send({ status: false, message: "price required" })
    }
    if ("noOfWinner" in body) {
      if (!isValid(noOfWinner)) return res.status(400).send({ status: false, message: "noOfWinner required" })
    }
    if ("noOfTicket" in body) {
      if (!isValid(noOfTicket)) return res.status(400).send({ status: false, message: "noOfTicket required" })
    }

    let result = { price,noOfWinner,noOfTicket }   

    let update = await feesModel.findOneAndUpdate({ _id:feeId }, result, { new: true })

    return res.status(200).send({ status: true, message: " fee  Updated successfully", data: update })

  } catch (err) {
    console.log(err)
    return res.status(500).send({ status: false, message: "server side errors", error: err.message })
  }
}

const feesDelete = async function (req, res) {
  try {
     let feeId = req.params.feeId

      if (!ObjectId.isValid(feeId)) {
          return res.status(400).send({ status: false, message: "fees ID is invalid" });
      }

      let deletedFees = await feesModel.findOneAndDelete({ _id:feeId});

      if (!deletedFees) {
          return res.status(404).send({ status: false, message: "fees does not exist" });
      }

      return res.status(200).send({ status: true, message: "fees deleted successfully" });

  } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
  }
};

  module.exports = {feesAdd,getFees,updateFees,searchFeesPacakageNamewise,feesDelete}