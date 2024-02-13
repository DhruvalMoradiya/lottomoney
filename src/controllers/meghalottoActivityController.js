const meghalottoActivityModel = require("../models/meghalottoActivityModel")
const mongoose = require('mongoose')
const ObjectId = require("mongoose").Types.ObjectId;

const isValid = function(x) {
    if (typeof x === "undefined" || x === null) return false;
    if (typeof x === "string" && x.trim().length === 0) return false;
    return true;
};
const isValidBody = function(x) {
    return Object.keys(x).length > 0;
};

const createMeghalottoActivity= async function (req, res) {
    try {
      const { contestId,date,ticket,contestFee,wonPrize,status } = req.body;

    if (!ObjectId.isValid(contestId)) {
        return res.status(400).send({ status: false, message: "contestId is invalid" });
      }

    if (!isValid(status)) {
      return res.status(400).send({ status: false, message: "status is required" });
    }

    if (!isValid(date)) {
      return res.status(400).send({ status: false, message: "date is required" });
    }

    if (!isValid(ticket)) {
        return res.status(400).send({ status: false, message: "ticket is required" });
      }
  
      if (!isValid(contestFee)) {
        return res.status(400).send({ status: false, message: "contestFee is required" });
      }

      if (!isValid(wonPrize)) {
        return res.status(400).send({ status: false, message: "wonPrize is required" });
      }

    let newMeghalottoActivity = {contestId,date,ticket,contestFee,wonPrize,status};

    let meghalottoActivityData = await meghalottoActivityModel.create(newMeghalottoActivity);
    return res.status(201).send({ status: true, message: "meghalottoActivityData created successfully", meghalottoActivityData });
} catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message });
}
  }




  const getMeghalottoActivity = async function (req, res) {
    try {
        const meghalottoActivityData = await meghalottoActivityModel
            .find({ isDeleted: false })
            .select({ date: 1, ticket: 1, contestFee: 1, wonPrize: 1, status: 1, contestId: 1 });

        return res.status(200).send({
            status: true,
            message: "MeghalottoActivity",
            meghalottoActivityData: meghalottoActivityData,
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};



//   const getMeghalottoActivity = async function (req, res) {
//     try {
//         let page = req.query.page || 1;
//         let pageSize = req.query.pageSize || 10;
//         let sortFields = req.query.sortFields || ['createdAt']; // Default sort field is 'createdAt'
//         let sortOrder = req.query.sortOrder || 'asc';
//         const searchKeyword = req.query.search || ''; // Default to an empty string if 'search' parameter is not provided

//         if (!Array.isArray(sortFields)) {
//             sortFields = [sortFields];
//         }

//         const query = {
//             isDeleted: false,
//             $or: [
//                 { date: { "$regex": searchKeyword, "$options": "i" } },
//                 { ticket: { "$regex": searchKeyword, "$options": "i" } },
//                 { contestFee: { "$regex": searchKeyword, "$options": "i" } },
//                 { wonPrize: { "$regex": searchKeyword, "$options": "i" } },
//                 { status: { "$regex": searchKeyword, "$options": "i" } },
//             ]
//         };

//         const meghalottoActivityCount = await meghalottoActivityModel.countDocuments(query); // Count the documents

//         let meghalottoActivityData = await meghalottoActivityModel
//             .find(query)
//             .select({ date: 1, ticket: 1, contestFee: 1,wonPrize: 1, status: 1, contestId: 1 })
//             .skip((page - 1) * pageSize)
//             .limit(pageSize);

//         // Sort based on sortFields and sortOrder
//         meghalottoActivityData = meghalottoActivityData.sort((a, b) => {
//             for (const field of sortFields) {
//                 let valueA = a[field];
//                 let valueB = b[field];

//                 // Convert values to numbers if sorting by rank
//                 if (field === 'rank') {
//                     valueA = parseInt(valueA);
//                     valueB = parseInt(valueB);
//                 }

//                 // Compare values
//                 if (valueA !== valueB) {
//                     if (sortOrder === 'asc') {
//                         return valueA - valueB;
//                     } else {
//                         return valueB - valueA;
//                     }
//                 }
//             }
//             return 0; // If all fields are equal, return 0 for stable sorting
//         });

//         // If sortOrder is ascending and sortFields include createdAt, reverse the array
//         if (sortOrder === 'asc' && sortFields.includes('createdAt')) {
//             meghalottoActivityData = meghalottoActivityData.reverse();
//         }

//         // Always return a 200 status, whether data is found or not
//         return res.status(200).send({
//             status: true,
//             message: "MeghalottoActivity",
//             count: meghalottoActivityCount, // Include the count in the response
//             meghalottoActivityData: meghalottoActivityData,
//         });
//     } catch (err) {
//         res.status(500).send({ status: false, msg: err.message });
//     }
// };

module.exports = {createMeghalottoActivity,getMeghalottoActivity};