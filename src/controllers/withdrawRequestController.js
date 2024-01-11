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


  const getWithdrawRequestData = async function (req, res) {
    try {
        let page = req.query.page || 1;
        let pageSize = req.query.pageSize || 10;
        let sortFields = req.query.sortFields || ['userName']; // Default sort field is 'userName'
        let sortOrder = req.query.sortOrder || 'asc';

        if (!Array.isArray(sortFields)) {
            sortFields = [sortFields];
        }

        const withdrawRequests = await withdrawRequestModel
            .find({ isDeleted: false })
            .select({ userId: 1, paymentId: 1, amount: 1, wallet: 1, accountNo: 1, remark: 1, status: 1, createdAt: 1, _id: 1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        if (withdrawRequests.length === 0) {
            return res.status(404).send({ status: false, msg: "No data found" });
        }

        const transformedWithdrawRequests = await Promise.all(withdrawRequests.map(async (withdrawRequest) => {
            let userName = "Unknown User"; // Default value if userId is not present
            let mobile = "Unknown Mobile"; // Default value if userId is not present

            if (withdrawRequest.userId) {
                const userDetail = await userModel.findOne({ _id: withdrawRequest.userId, isDeleted: false });

                // Check if userDetail is not null before accessing properties
                if (userDetail) {
                    userName = userDetail.userName || userName;
                    mobile = userDetail.mobile || mobile;
                }
            }

            return {
                userId: withdrawRequest.userId,
                userName,
                mobile,
                paymentId: withdrawRequest.paymentId,
                amount: withdrawRequest.amount,
                wallet: withdrawRequest.wallet,
                accountNo: withdrawRequest.accountNo,
                remark: withdrawRequest.remark,
                status: withdrawRequest.status,
                orderId: withdrawRequest._id,
                date: withdrawRequest.createdAt
            };
        }));

        const sortOptions = {};
        for (const field of sortFields) {
            sortOptions[field] = sortOrder === 'asc' ? 1 : -1;
        }

        const sortedWithdrawRequests = transformedWithdrawRequests.sort((a, b) => {
            for (const field of sortFields) {
                const valueA = a[field];
                const valueB = b[field];

                // Default sorting for non-numeric fields
                const compareResult = sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                if (compareResult !== 0) {
                    return compareResult;
                }
            }
            return 0;
            
        });

        return res.status(200).send({
            status: true,
            message: "Withdraw Request Data",
            withdrawRequestData: sortedWithdrawRequests,
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

  const searchWithdrawRequest = async function (req, res) {
    try {
        let page = req.query.page || 1;
        let pageSize = req.query.pageSize || 10;
        const searchKeyword = req.params.key;
        const keywordRegex = new RegExp(searchKeyword, 'i');

        // Search in userModel for userName or mobile
        const recordData = await userModel.find({
            $or: [
                { userName: { $regex: keywordRegex } },
                { mobile: { $regex: keywordRegex } },
            ]
        }).select({
            userName: 1,
            mobile: 1,
            _id:1
        })
        .skip((page - 1) * pageSize)
        .limit(pageSize);

        if (recordData.length === 0) {
            return res.status(404).send({ success: true, msg: "Record not found" });
        }

        const modifiedWithdrawRequestDetail = [];

        for (const user of recordData) {
            // Search in withdrawRequestModel for associated records
            const feesData = await withdrawRequestModel
                .find({ userId: user._id })
                .select({ paymentId: 1, amount: 1, wallet: 1, accountNo: 1, remark: 1, status: 1, createdAt:1, _id: 1 });

            if (feesData.length > 0) {
                const withdrawRequest = feesData.map((withdrawRequest) => ({
                    paymentId: withdrawRequest.paymentId,
                    amount: withdrawRequest.amount,
                    wallet: withdrawRequest.wallet,
                    accountNo: withdrawRequest.accountNo,
                    remark: withdrawRequest.remark,
                    status: withdrawRequest.status,
                    date:withdrawRequest.createdAt,
                    orderId: withdrawRequest._id,
                }));

                modifiedWithdrawRequestDetail.push({
                    userName: user.userName,
                    mobile: user.mobile,
                    ...withdrawRequest[0], // Spread the properties directly into the main object
                });
            }
        }

        if (modifiedWithdrawRequestDetail.length > 0) {
            const filteredData = modifiedWithdrawRequestDetail.filter(record =>
                record.userName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                record.mobile.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                record.paymentId.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                record.amount.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                record.wallet.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                record.accountNo.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                record.remark.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                record.status.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                record.orderId.toLowerCase().includes(searchKeyword.toLowerCase())
            );

            res.status(200).send({ success: true, msg: "Fees Record details", data: filteredData });
        } else {
            res.status(404).send({ success: true, msg: "No associated records found" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};


// const searchWithdrawRequest = async function (req, res) {
//     try {
//       let page = req.query.page || 1;
//       let pageSize = req.query.pageSize || 10;
//       const searchKeyword = req.query.key;
//       const keywordRegex = new RegExp(searchKeyword, 'i');
  
//       const aggregatePipeline = [
//         {
//             $match: {
//                 $or: [
//                   { userName: { $regex: keywordRegex } },
//                   { mobile: { $regex: keywordRegex } },
//                   { 'withdrawRequestData.paymentId': { $regex: keywordRegex } },
//                   { 'withdrawRequestData.amount': { $regex: keywordRegex } },
//                   { 'withdrawRequestData.wallet': { $regex: keywordRegex } },
//                   { 'withdrawRequestData.accountNo': { $regex: keywordRegex } },
//                   { 'withdrawRequestData.remark': { $regex: keywordRegex } },
//                   { 'withdrawRequestData.status': { $regex: keywordRegex } },
//                   { 'withdrawRequestData.createdAt': { $regex: keywordRegex } },
//                   { 'withdrawRequestData._id': { $regex: keywordRegex } },
//                 ],
//               },
//         },
//         {
//           $lookup: {
//             from: 'withdrawrequests', // Assuming the name of your withdrawal request collection
//             localField: '_id',
//             foreignField: 'userId',
//             as: 'withdrawRequestData',
//           },
//         },
//         {
//           $unwind: {
//             path: '$withdrawRequestData',
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//         {
//           $match: {
//             withdrawRequestData: { $exists: true } // Filter out users without associated data
//           },
//         },
//         {
//           $project: {
//             userName: 1,
//             mobile: 1,
//             paymentId: '$withdrawRequestData.paymentId',
//             amount: '$withdrawRequestData.amount',
//             wallet: '$withdrawRequestData.wallet',
//             accountNo: '$withdrawRequestData.accountNo',
//             remark: '$withdrawRequestData.remark',
//             status: '$withdrawRequestData.status',
//             date: '$withdrawRequestData.createdAt',
//             orderId: '$withdrawRequestData._id',
//           },
//         },
//         {
//           $skip: (page - 1) * pageSize,
//         },
//         {
//           $limit: pageSize,
//         },
//       ];
  
//       const result = await userModel.aggregate(aggregatePipeline);

//       console.log('Result:', result); // Add this line for debugging
      
//       console.log('Search Keyword:', searchKeyword);
// console.log('Intermediate Result after $match:', result);

//   if (result.length > 0) {
//   res.status(200).send({ success: true, msg: "Withdraw Request details", data: result });
//  } else {
//   res.status(404).send({ success: true, msg: "No associated records found" });
// }
//     } catch (error) {
//       res.status(400).send({ success: false, msg: error.message });
//     }
// };

  module.exports = {addWithdrawRequestData,getWithdrawRequestData,searchWithdrawRequest}