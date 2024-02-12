const prizePoolModel = require("../models/prizepoolMasterModel")
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

const createPrizePool= async function (req, res) {
    try {
      const { price,rank } = req.body;
  
    if (!isValid(price)) {
      return res.status(400).send({ status: false, message: "price is required" });
    }

    if (!isValid(rank)) {
      return res.status(400).send({ status: false, message: "rank is required" });
    }
    let newPrizePool = {price,rank};

    let prizePoolData = await prizePoolModel.create(newPrizePool);
    return res.status(201).send({ status: true, message: "prizePoolData created successfully", prizePoolData });
} catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message });
}
  }


  const getPrizePool = async function (req, res) {
    try {
        let page = req.query.page || 1;
        let pageSize = req.query.pageSize || 10;
        let sortFields = req.query.sortFields || ['createdAt']; // Default sort field is 'createdAt'
        let sortOrder = req.query.sortOrder || 'asc';
        const searchKeyword = req.query.search || ''; // Default to an empty string if 'search' parameter is not provided

        if (!Array.isArray(sortFields)) {
            sortFields = [sortFields];
        }

        const query = {
            isDeleted: false,
            $or: [
                { price: { "$regex": searchKeyword, "$options": "i" } },
                { rank: { "$regex": searchKeyword, "$options": "i" } }
            ]
        };

        const prizePoolCount = await prizePoolModel.countDocuments(query); // Count the documents

        let prizePoolData = await prizePoolModel
            .find(query)
            .select({ price: 1, rank: 1, _id: 1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        // Sort based on sortFields and sortOrder
        prizePoolData = prizePoolData.sort((a, b) => {
            for (const field of sortFields) {
                let valueA = a[field];
                let valueB = b[field];

                // Convert values to numbers if sorting by rank
                if (field === 'rank') {
                    valueA = parseInt(valueA);
                    valueB = parseInt(valueB);
                }

                // Compare values
                if (valueA !== valueB) {
                    if (sortOrder === 'asc') {
                        return valueA - valueB;
                    } else {
                        return valueB - valueA;
                    }
                }
            }
            return 0; // If all fields are equal, return 0 for stable sorting
        });

        // If sortOrder is ascending and sortFields include createdAt, reverse the array
        if (sortOrder === 'asc' && sortFields.includes('createdAt')) {
            prizePoolData = prizePoolData.reverse();
        }

        // Always return a 200 status, whether data is found or not
        return res.status(200).send({
            status: true,
            message: "PrizePool",
            count: prizePoolCount, // Include the count in the response
            prizePoolData: prizePoolData,
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

const updatePrizePool = async function (req, res) {
    try {
      let body = req.body
      let prizePoolId = req.params.prizePoolId
  
      let {price,rank} = body
  
      if ("price" in body) {
        if (!isValid(price)) return res.status(400).send({ status: false, message: "price required" })
      }
      if ("rank" in body) {
        if (!isValid(rank)) return res.status(400).send({ status: false, message: "rank required" })
      }
  
      let result = {price,rank}   
  
      let update = await prizePoolModel.findOneAndUpdate({ _id:prizePoolId }, result, { new: true })
  
      return res.status(200).send({ status: true, message: " PrizePool  Updated successfully", data: update })
  
    } catch (err) {
      console.log(err)
      return res.status(500).send({ status: false, message: "server side errors", error: err.message })
    }
  }


const prizePoolDelete = async function (req, res) {
    try {
         let prizePoolId = req.params.prizePoolId

        if (!ObjectId.isValid(prizePoolId)) {
            return res.status(400).send({ status: false, message: "prizePoolId is invalid" });
        }

        let deletedPrizePool = await prizePoolModel.findOneAndDelete({ _id:prizePoolId, isDeleted: false });

        if (!deletedPrizePool) {
            return res.status(404).send({ status: false, message: "PrizePool does not exist" });
        }

        return res.status(200).send({ status: true, message: "PrizePool deleted successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

  module.exports = {createPrizePool,getPrizePool,updatePrizePool,prizePoolDelete};