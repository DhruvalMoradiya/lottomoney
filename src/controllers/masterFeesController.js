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

//   const getFees = async function (req, res) {
//     try {
//         let page = req.query.page || 1;
//         let pageSize = req.query.pageSize || 10;
//         let sortOrder = req.query.sortOrder || 'asc';

//         const sortField = req.query.sortField || 'packageName';

//         const fees = await feesModel
//             .find({ isDeleted: false })
//             .select({ price: 1, noOfWinner: 1, noOfTicket: 1, packageId: 1, _id: 1 })
//             .skip((page - 1) * pageSize)
//             .limit(pageSize);

//         if (fees.length === 0) {
//             return res.status(404).send({ status: false, msg: "No data found" });
//         }

//         const transformedFees = await Promise.all(fees.map(async (fee) => {
//             let packageName = "Unknown Package";

//             if (fee.packageId) {
//                 const packageDetail = await packagesModel.findOne({ _id: fee.packageId, isDeleted: false });
//                 packageName = packageDetail ? packageDetail.packageName : "Unknown Package";
//             }

//             return {
//                 feeId: fee._id,
//                 packageName,
//                 price: fee.price,
//                 noOfWinner: fee.noOfWinner,
//                 noOfTicket: fee.noOfTicket,
//             };
//         }));

//       const numericFields = ['price', 'noOfWinner', 'noOfTicket'];

//         transformedFees.forEach((fee) => {
//         numericFields.forEach((field) => {
//         fee[field] = parseInt(fee[field]);
//           });
//        });
//         // Sorting the transformedFees array based on the specified field and sortOrder
//         transformedFees.sort((a, b) => {
//           if (a[sortField] < b[sortField]) {
//               return sortOrder === 'asc' ? -1 : 1;
//           }
//           if (a[sortField] > b[sortField]) {
//               return sortOrder === 'asc' ? 1 : -1;
//           }
//           return 0;
//       });

//         return res.status(200).send({
//             status: true,
//             message: "feesData",
//             feesList: transformedFees,
//         });
//     } catch (err) {
//         res.status(500).send({ status: false, msg: err.message });
//     }
// };

const getFees = async function (req, res) {
  try {
    const searchKeyword = req.query.search;
    const sortField = req.query.sortField || '_id';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const keywordRegex = new RegExp(searchKeyword, 'i');
    const isNumeric = !isNaN(searchKeyword);

    const aggregatePipeline = [
      {
        $lookup: {
          from: 'fees',
          localField: '_id',
          foreignField: 'packageId',
          as: 'feesData',
        },
      },
      {
        $match: {
          feesData: { $exists: true, $ne: [] }, // Filter out documents without feesData
        },
      },
      {
        $unwind: {
          path: '$feesData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          packageName: 1,
          feeId: '$feesData._id',
          price: { $toInt: '$feesData.price' },
          noOfWinner: { $toInt: '$feesData.noOfWinner' },
          noOfTicket: { $toInt: '$feesData.noOfTicket' },
        },
      },
      {
        $match: {
          $or: [
            { packageName: { $regex: keywordRegex } },
            { price: isNumeric ? { $eq: parseInt(searchKeyword) } : { $regex: keywordRegex } },
            { noOfWinner: isNumeric ? { $eq: parseInt(searchKeyword) } : { $regex: keywordRegex } },
            { noOfTicket: isNumeric ? { $eq: parseInt(searchKeyword) } : { $regex: keywordRegex } },
          ],
        },
      },
      {
        $sort: {
          [sortField]: sortOrder,
        },
      },
      {
        $skip: (page - 1) * pageSize,
      },
      {
        $limit: pageSize,
      },
    ];

    const packagesWithFees = await packagesModel.aggregate(aggregatePipeline);

    res.status(200).json({
      status: true,
      message: 'Packages with associated fees',
      feesList: packagesWithFees,
    });
  } catch (error) {
    console.error('Error in getFees:', error);
    res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const updateFees = async function (req, res) {
  try {
    let body = req.body
    let feeId = req.params.feeId
    
   // if (!isValidBody(body)) return res.status(400).send({ status: false, message: "Body is empty to update " })
     if (!isValidBody(body) && !req.files) return res.status(400).send({ status: false, message: "Body is empty to update " })


    let {price,noOfWinner,noOfTicket,packageId} = body

    if (!ObjectId.isValid(feeId)) {
      return res.status(400).send({ status: false, message: "feeId is invalid" });
    }
    if (!ObjectId.isValid(packageId)) {
      return res.status(400).send({ status: false, message: "packageId is invalid" });
    }
    if ("price" in body) {
      if (!isValid(price)) return res.status(400).send({ status: false, message: "price required" })
    }
    if ("noOfWinner" in body) {
      if (!isValid(noOfWinner)) return res.status(400).send({ status: false, message: "noOfWinner required" })
    }
    if ("noOfTicket" in body) {
      if (!isValid(noOfTicket)) return res.status(400).send({ status: false, message: "noOfTicket required" })
    }

    let result = { price,noOfWinner,noOfTicket,packageId }   

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

  module.exports = {feesAdd,getFees,updateFees,feesDelete}