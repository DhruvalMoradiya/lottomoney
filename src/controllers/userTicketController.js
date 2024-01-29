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
      const { userId, contestId } = req.body;
  

      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ status: false, message: "userID is invalid" });
    }

    if (!ObjectId.isValid(contestId)) {
        return res.status(400).send({ status: false, message: "contestId is invalid" });
    }
  
      const newWinner = new ticketModel({ userId, contestId });
      const savedWinner = await newWinner.save();
  
      res.status(201).json(savedWinner);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


const getMyTicket = async function (req, res) {
    try {
      const userId = req.params.userId; // Extract user ID from request parameters

      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ status: false, message: "userID is invalid" });
    }
      // Use the userId in the find query
      const winners = await ticketModel.find({ userId });
  
      res.json(winners);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  
  module.exports = {createTicket,getMyTicket};