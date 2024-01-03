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
        const fees = await feesModel
            .find({ isDeleted: false })
            .select({ price: 1, noOfWinner: 1, noOfTicket: 1, packageId: 1, _id: 0 });

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

  module.exports = {feesAdd,getFees}