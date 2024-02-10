const ticketModel = require("../models/userTicketModel")
const { uploadFile } = require('../aws/fileUpload')
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

const createTicket= async function (req, res) {
    try {
      const { userId, contestId,entryFee,ticketNo } = req.body;
  

      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ status: false, message: "userID is invalid" });
    }

    if (!ObjectId.isValid(contestId)) {
        return res.status(400).send({ status: false, message: "contestId is invalid" });
    }
  
    if (!isValid(entryFee)) {
      return res.status(400).send({ status: false, message: "entryFee is required" });
    }

    if (!isValid(ticketNo)) {
      return res.status(400).send({ status: false, message: "ticketNo is required" });
    }
      const newWinner = new ticketModel({ userId, contestId,entryFee,ticketNo });
      const savedWinner = await newWinner.save();
  
      res.status(201).json(savedWinner);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  const { Types } = mongoose;

  const getMyTicket = async function (req, res) {
    try {
      const userId = req.params.userId;
  
      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ status: false, message: "userID is invalid" });
      }
  
      // Use the userId in the find query and populate the associated contest data
      const winners = await ticketModel.find({ userId }).populate('contestId');
  
      // Map the results to the desired format
      const transformedWinners = winners.map(({ _id, userId,entryFee,ticketNo,contestId }) => ({
        _id,
        userId,
        entryFee,
        ticketNo,
        startDate: contestId.startDate,
        endDate: contestId.endDate,
        participants: contestId.participants,
        status: contestId.status,
      }));
  
      res.json(transformedWinners);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  module.exports = {createTicket,getMyTicket};