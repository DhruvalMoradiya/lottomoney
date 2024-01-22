const withdrawRequestModel = require("../models/withdrawRequestModel");
const userModel = require("../models/userModel")
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


const addWithdrawRequestData = async function (req, res) {
    try {
      let body = req.body;
      let { paymentId, amount, wallet, accountNo, remark, status } = body;
  
      if (!isValidBody(paymentId)) {
        return res.status(400).send({ status: false, message: "paymentId cannot be blank" });
      }
  
      if (!isValid(amount)) {
        return res.status(400).send({ status: false, message: "amount is required" });
      }
  
      if (!isValid(wallet)) {
        return res.status(400).send({ status: false, message: "wallet is required" });
      }
  
      if (!isValid(accountNo)) {
        return res.status(400).send({ status: false, message: "accountNo is required" });
      }
  
      if (!isValid(remark)) {
        return res.status(400).send({ status: false, message: "remark is required" });
      }
  
      if (!isValid(status)) {
        return res.status(400).send({ status: false, message: "status is required" });
      }
  
      // Fetch userId from token
      const userId = req.token.userId; // Adjust the property according to how the user ID is stored in the token
  
      // Create new record
      let newWithdrawRequesData = {
        userId,
        paymentId,
        amount,
        wallet,
        accountNo,
        remark,
        status,
      };
  
      let withdrawRequestData = await withdrawRequestModel.create(newWithdrawRequesData);
      return res.status(201).send({ status: true, message: "withdrawRequestData added successfully", withdrawRequestData });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Server-side Errors. Please try again later", error: error.message });
    }
  };


//   const getWithdrawRequestData = async function (req, res) {
//     try {
//         let page = req.query.page || 1;
//         let pageSize = req.query.pageSize || 10;
//         let sortFields = req.query.sortFields || ['userName']; // Default sort field is 'userName'
//         let sortOrder = req.query.sortOrder || 'asc';

//         if (!Array.isArray(sortFields)) {
//             sortFields = [sortFields];
//         }

//         const withdrawRequests = await withdrawRequestModel
//             .find({ isDeleted: false })
//             .select({ userId: 1, paymentId: 1, amount: 1, wallet: 1, accountNo: 1, remark: 1, status: 1, createdAt: 1, _id: 1 })
//             .skip((page - 1) * pageSize)
//             .limit(pageSize);

//         if (withdrawRequests.length === 0) {
//             return res.status(404).send({ status: false, msg: "No data found" });
//         }

//         const transformedWithdrawRequests = await Promise.all(withdrawRequests.map(async (withdrawRequest) => {
//             let userName = "Unknown User"; // Default value if userId is not present
//             let mobile = "Unknown Mobile"; // Default value if userId is not present

//             if (withdrawRequest.userId) {
//                 const userDetail = await userModel.findOne({ _id: withdrawRequest.userId, isDeleted: false });

//                 // Check if userDetail is not null before accessing properties
//                 if (userDetail) {
//                     userName = userDetail.userName || userName;
//                     mobile = userDetail.mobile || mobile;
//                 }
//             }

//             return {
//                 userId: withdrawRequest.userId,
//                 userName,
//                 mobile,
//                 paymentId: withdrawRequest.paymentId,
//                 amount: withdrawRequest.amount,
//                 wallet: withdrawRequest.wallet,
//                 accountNo: withdrawRequest.accountNo,
//                 remark: withdrawRequest.remark,
//                 status: withdrawRequest.status,
//                 orderId: withdrawRequest._id,
//                 date: withdrawRequest.createdAt
//             };
//         }));

//         const sortOptions = {};
//         for (const field of sortFields) {
//             sortOptions[field] = sortOrder === 'asc' ? 1 : -1;
//         }

//         const sortedWithdrawRequests = transformedWithdrawRequests.sort((a, b) => {
//             for (const field of sortFields) {
//                 const valueA = a[field];
//                 const valueB = b[field];

//                 // Default sorting for non-numeric fields
//                 const compareResult = sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
//                 if (compareResult !== 0) {
//                     return compareResult;
//                 }
//             }
//             return 0;
            
//         });

//         return res.status(200).send({
//             status: true,
//             message: "Withdraw Request Data",
//             withdrawRequestData: sortedWithdrawRequests,
//         });
//     } catch (err) {
//         res.status(500).send({ status: false, msg: err.message });
//     }
// };

const getWithdrawRequestData = async function (req, res) {
  try {
    let page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    const searchKeyword = req.query.search;
    const keywordRegex = new RegExp(searchKeyword, 'i');
    const isNumeric = !isNaN(searchKeyword);
    const sortField = req.query.sortField || '_id'; // Default sort field
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // Default to ascending order

    const aggregatePipeline = [
      {
        $lookup: {
          from: 'withdrawrequests',
          localField: '_id',
          foreignField: 'userId',
          as: 'withdrawRequestData',
        },
      },
      {
        $unwind: {
          path: '$withdrawRequestData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          withdrawRequestData: { $exists: true },
        },
      },
      {
        $project: {
          userName: 1,
          mobile: 1,
          paymentId: {
            $convert: {
              input: '$withdrawRequestData.paymentId',
              to: 'int',
              onError: 0,
              onNull: 0,
            },
          },
          amount: {
            $convert: {
              input: '$withdrawRequestData.amount',
              to: 'int',
              onError: 0,
              onNull: 0,
            },
          },
          wallet: '$withdrawRequestData.wallet',
          accountNo: {
            $convert: {
              input: '$withdrawRequestData.accountNo',
              to: 'int',
              onError: 0,
              onNull: 0,
            },
          },
          remark: '$withdrawRequestData.remark',
          status: '$withdrawRequestData.status',
          orderId: '$withdrawRequestData._id',
          date: '$withdrawRequestData.createdAt',
        },
      },
      {
        $match: {
          $or: [
            { userName: { $regex: keywordRegex } },
            { mobile: { $regex: keywordRegex } },
            { paymentId: isNumeric ? { $eq: parseInt(searchKeyword) } : { $regex: keywordRegex } },
            { amount: isNumeric ? { $eq: parseInt(searchKeyword) } : { $regex: keywordRegex } },
            { wallet: { $regex: keywordRegex } },
            { accountNo: isNumeric ? { $eq: parseInt(searchKeyword) } : { $regex: keywordRegex } },
            { remark: { $regex: keywordRegex } },
            { status: { $regex: keywordRegex } },
            { date: { $regex: keywordRegex } },
          ],
        },
      },
      {
        $facet: {
          result: [
            {
              $sort: { [sortField]: sortOrder },
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

    const result = await userModel.aggregate(aggregatePipeline);

    // Extracting the count from the result
    const count = result[0]?.count[0]?.total || 0;
    const withdrawRequestData = result[0]?.result || [];

    res.status(200).json({
      status: true,
      message: 'Withdraw Request Data',
      count: count,
      withdrawRequestData: withdrawRequestData,
    });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

  const countWithdrawalStatus = async function (req, res) {
    try {
        const successFullyWithdrawCount = await withdrawRequestModel.countDocuments({
            status: { $regex: new RegExp('approved', 'i') }
        });

        const withdrawRejectedCount = await withdrawRequestModel.countDocuments({
            status: { $regex: new RegExp('rejected', 'i') }
        });

        const response = {
            success: true,
            message: 'Count Withdrawal Status',
            successFullyWithdrawCount: successFullyWithdrawCount,
            withdrawRejectedCount: withdrawRejectedCount,
        };

        res.json(response);
    } catch (error) {
        console.error('Error counting withdrawal status:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
  module.exports = {addWithdrawRequestData,getWithdrawRequestData,countWithdrawalStatus}