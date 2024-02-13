const contestModel = require("../models/contestModel");
const packagesModel = require("../models/masterPackagesModel");
const userModel = require("../models/userModel")
const withdrawRequestModel = require("../models/withdrawRequestModel");
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


const addContestData = async function (req, res) {
  try {
      let body = req.body;
      let { startDate, endDate, status } = body;

      if (!isValidBody(body)) {
          return res.status(400).send({ status: false, message: "Body cannot be blank" });
      }

      if (!isValid(startDate)) {
          return res.status(400).send({ status: false, message: "startDate is required" });
      }

      if (!isValid(endDate)) {
          return res.status(400).send({ status: false, message: "endDate is required" });
      }

      // Create new record
      let newContestData = {
        startDate,
        endDate,
        status,
      };

      let contestData = await contestModel.create(newContestData);
      return res.status(201).send({ status: true, message: "contest data added successfully", contestData });
  } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Server-side Errors. Please try again later", error: error.message });
  }
};


const getContestData = async function (req, res) {
    try {
        let page = req.query.page || 1;
        let pageSize = req.query.pageSize || 10;
        let sortFields = req.query.sortFields || ['startDate'];
        let sortOrder = req.query.sortOrder || 'asc';

        if (!Array.isArray(sortFields)) {
            sortFields = [sortFields];
        }

        let query = { isDeleted: false };

        // Check if it's a search query
        if (req.query.search) {
            const key = req.query.search;

            query.$or = [
                { status: { "$regex": new RegExp(key, "i") } },
                { startDate: { "$regex": new RegExp(key, "i") } },
                { endDate: { "$regex": new RegExp(key, "i") } },
                { participants: { "$regex": new RegExp(key, "i") } }
            ];
        }

        const contestCount = await contestModel.countDocuments(query); // Count the documents

        const contestData = await contestModel
            .find(query)
            .select({ startDate: 1, endDate: 1, participants: 1, status: 1, _id: 1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        // Always return a 200 status, whether data is found or not
        return res.status(200).send({
            status: true,
            message: "contestData",
            count: contestCount, // Include the count in the response
            contestData: contestData.sort((a, b) => {
                for (const field of sortFields) {
                    const valueA = a[field];
                    const valueB = b[field];

                    if (field === 'participants') {
                        // Custom sorting for the participants field (treat as string)
                        const numericValueA = parseInt(valueA) || 0;
                        const numericValueB = parseInt(valueB) || 0;

                        if (numericValueA !== numericValueB) {
                            return sortOrder === 'asc' ? numericValueA - numericValueB : numericValueB - numericValueA;
                        }
                    } else {
                        // Default sorting for other fields
                        if (valueA !== undefined && valueB !== undefined) {
                            return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                        } else if (valueA !== undefined) {
                            return sortOrder === 'asc' ? 1 : -1;
                        } else if (valueB !== undefined) {
                            return sortOrder === 'asc' ? -1 : 1;
                        }
                    }
                }

                return 0;
            }),
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

const searchContest = async function (req, res) {
    await getContestData(req, res, true);
};




const updateContest = async function (req, res) {
    try {
      let body = req.body
      let contestId = req.params.contestId
      
     // if (!isValidBody(body)) return res.status(400).send({ status: false, message: "Body is empty to update " })
       if (!isValidBody(body) && !req.files) return res.status(400).send({ status: false, message: "Body is empty to update " })
  
  
      let {startDate,endDate,participants,status} = body
  
      
      if ("startDate" in body) {
        if (!isValid(startDate)) return res.status(400).send({ status: false, message: "startDate required" })
      }
      if ("endDate" in body) {
        if (!isValid(endDate)) return res.status(400).send({ status: false, message: "endDate required" })
      }
      if ("participants" in body) {
        if (!isValid(participants)) return res.status(400).send({ status: false, message: "participants required" })
      }
      if ("status" in body) {
        if (!isValid(status)) return res.status(400).send({ status: false, message: "status required" })
      }
  
      let result = { startDate,endDate,participants,status}   
  
      let update = await contestModel.findOneAndUpdate({ _id:contestId }, result, { new: true })
  
      return res.status(200).send({ status: true, message: " contest  Updated successfully", data: update })
  
    } catch (err) {
      console.log(err)
      return res.status(500).send({ status: false, message: "server side errors", error: err.message })
    }
  }

const contestDelete = async function (req, res) {
    try {
        let contestId = req.params.contestId;

        if (!ObjectId.isValid(contestId)) {
            return res.status(400).send({ status: false, message: "contest ID is invalid" });
        }

        let deletedContest = await contestModel.findOneAndDelete({ _id:contestId, isDeleted: false });

        if (!deletedContest) {
            return res.status(404).send({ status: false, message: "Contest does not exist" });
        }

        return res.status(200).send({ status: true, message: "Contest deleted successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};


const countAllContests = async function (req, res) {
    try {
        const upcomingContestsCount = await contestModel.countDocuments({
            status: { $regex: new RegExp('upcoming', 'i') }
        });

        const liveContestsCount = await contestModel.countDocuments({
            status: { $regex: new RegExp('live', 'i') }
        });

        const finishedContestsCount = await contestModel.countDocuments({
            status: { $regex: new RegExp('finished', 'i') }
        });

        const resultAnnouncedContestsCount = await contestModel.countDocuments({
            status: { $regex: new RegExp('resultannounced', 'i') }
        });

        const totalContestsCount = await contestModel.countDocuments();
        
        const totalContesttype = await packagesModel.countDocuments();

        const response = {
            success: true,
            message: 'Counts',
            upcomingContestsCount: upcomingContestsCount,
            liveContestsCount: liveContestsCount,
            finishedContestsCount: finishedContestsCount,
            resultAnnouncedContestsCount: resultAnnouncedContestsCount,
            totalContestsCount: totalContestsCount,
            totalContesttype: totalContesttype,
        };

        res.json(response);
    } catch (error) {
        console.error('Error counting data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

const contestGetDetails = async function (req, res) {
    try {
        let data = req.query;

        const contestDetail = await contestModel.find({ $and: [data,{ isDeleted: false }] })
        .select({ startDate:1, endDate:1, status:1,})

        if (contestDetail.length == 0) {
            return res.status(404).send({ status: false, msg: "No contest found" });
        }

        if (contestDetail.length > 0) {
            return res.status(200).send({ status: true, message: "contest details", data: contestDetail });
        }
        else {
            return res.status(404).send({ status: false, message: "No contest found" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

const contestGetLiveDetails = async function (req, res) {
    try {
        let data = req.query;

        const contestDetail = await contestModel.find({ $and: [data,{status: { $regex: new RegExp('live', 'i') },isDeleted: false }] })
        .select({ startDate:1, endDate:1, status:1,})

        if (contestDetail.length == 0) {
            return res.status(404).send({ status: false, msg: "No contest found" });
        }

        if (contestDetail.length > 0) {
            return res.status(200).send({ status: true, message: "contest details", data: contestDetail });
        }
        else {
            return res.status(404).send({ status: false, message: "No contest found" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

const contestGetUpcomingDetails = async function (req, res) {
    try {
        let data = req.query;

        const contestDetail = await contestModel.find({ $and: [data,{status: { $regex: new RegExp('upcoming', 'i') },isDeleted: false }] })
        .select({ startDate:1, endDate:1, status:1,})

        if (contestDetail.length == 0) {
            return res.status(404).send({ status: false, msg: "No contest found" });
        }

        if (contestDetail.length > 0) {
            return res.status(200).send({ status: true, message: "contest details", data: contestDetail });
        }
        else {
            return res.status(404).send({ status: false, message: "No contest found" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}


const endContestDetails = async function (req, res) {
    try {
        const currentDate = new Date(); // Current date and time
        const formattedDate = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
        // Extracting the current month and year
        const currentMonth = currentDate.getMonth() + 1; // Month is zero-indexed, so adding 1
        const currentYear = currentDate.getFullYear();

        // Calculate the previous month and year
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        // Query to find contests that are not deleted and have end dates matching the current month or the previous month
        const contests = await contestModel.aggregate([
            {
                $match: {
                    isDeleted: false,
                    $expr: {
                        $or: [
                            {
                                $and: [
                                    { $eq: [{ $year: { $toDate: "$endDate" } }, currentYear] },
                                    { $eq: [{ $month: { $toDate: "$endDate" } }, currentMonth] },
                                    { $lte: [{ $toDate: "$endDate" }, currentDate] }
                                ]
                            },
                            {
                                $and: [
                                    { $eq: [{ $year: { $toDate: "$endDate" } }, previousYear] },
                                    { $eq: [{ $month: { $toDate: "$endDate" } }, previousMonth] }
                                ]
                            }
                        ]
                    }
                }
            }
        ]);

        // If no contests are found, return a 404 status with a message
        if (contests.length === 0) {
            return res.status(404).send({ status: false, msg: "No ended contest found" });
        }

        // If contests are found, return a 200 status with the ended contest details
        return res.status(200).send({ status: true, message: "Ended contest details", currentDate: formattedDate, data: contests });
    } catch (err) {
        console.error(err);
        // If an error occurs during execution, return a 500 status with an error message
        res.status(500).send({ status: false, msg: "Internal Server Error" });
    }
};
  module.exports = {addContestData,getContestData,searchContest,updateContest,contestDelete,countAllContests,contestGetDetails,contestGetLiveDetails,
                    contestGetUpcomingDetails,endContestDetails}