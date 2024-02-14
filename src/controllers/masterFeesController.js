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

      const lastFees = await feesModel.findOne({}, {}, { sort: { 'customId': -1 } });
      let lastId = 0;

      // If lastUser exists, retrieve customId
      if (lastFees) {
          lastId = parseInt(lastFees.customId) || 0;
      }

      // Generate new customId
      const newId = lastId + 1;

      // Set customId in body
      body.customId = newId.toString();
  
      let newfeesData = {
          customId:newId,
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
    const searchKeyword = req.query.search;
    const sortField = req.query.sortField || 'customId';
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
          customId:{ $toInt: '$feesData.customId' },
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
            { customId: isNumeric ? { $eq: parseInt(searchKeyword) } : { $regex: keywordRegex } },
            { noOfWinner: isNumeric ? { $eq: parseInt(searchKeyword) } : { $regex: keywordRegex } },
            { noOfTicket: isNumeric ? { $eq: parseInt(searchKeyword) } : { $regex: keywordRegex } },
          ],
        },
      },
      {
        $facet: {
          result: [
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
          ],
          count: [
            {
              $count: 'total',
            },
          ],
        },
      },
    ];

    const result = await packagesModel.aggregate(aggregatePipeline);

    // Extracting the count from the result
    const count = result[0]?.count[0]?.total || 0;
    const packagesWithFees = result[0]?.result || [];

    res.status(200).json({
      status: true,
      message: 'Packages with associated fees',
      count: count,
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

const calculateTotal = (price, noOfTicket, noOfWinner) => {
  return price * noOfTicket - price * noOfWinner;
};

const calculateNetProfitMonthWise = async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Calculate the start date for 7 months ago
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(currentDate.getMonth() - 7);

    // Query data for the last 7 months
    const data = await feesModel.find({
      createdAt: { $gte: sevenMonthsAgo, $lte: currentDate },
      /* Add any other criteria as needed */
    }).lean();

    const result = {};

    // Initialize result object with all months and initial total 0
    const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    allMonths.forEach(month => result[month] = 0);

    // Iterate through each month's data and calculate the total
    data.forEach(({ _id, price, noOfTicket, noOfWinner, createdAt }) => {
      const month = new Date(createdAt).toLocaleString('default', { month: 'long' });
      const total = calculateTotal(parseFloat(price), parseFloat(noOfTicket), parseFloat(noOfWinner));

      // Add the total to the result object for the corresponding month
      result[month] += total;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getFeesByPackageId = async function (req, res) {
  try {
    const packageId = req.params.packageId;

    // Retrieve fees for the given packageId
    const fees = await feesModel.find({ packageId, isDeleted: false });

    // Retrieve the package details for the given packageId
    const packageDetails = await packagesModel.findById(packageId);

    // Extract the package name from the package details
    const packageName = packageDetails ? packageDetails.packageName : null;

    return res.status(200).send({
      status: true,
      message: "Fees details",
      packageName: packageName,
      data: fees
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

  module.exports = {feesAdd,getFees,updateFees,feesDelete,calculateNetProfitMonthWise,getFeesByPackageId}