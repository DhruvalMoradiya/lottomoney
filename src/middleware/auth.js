const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const userModel=require("../models/userModel")
// const mongoose = require("mongoose");


////////////////////////////*Authentication*//////////////////////////////////////////////////////////////////
const authentication = function (req, res, next) {
    try {
        let token=req.headers[`Authorization`];
        if(!token) token=req.headers[`authorization`];  
        
        if (!token) return res.status(401).send({ status: false, msg: "Token must be present in Headers" });
        
        token = token.split(" ")[1] 


        let decodedToken = jwt.verify(token, "SECRET", (error, decodedToken) => {
            if (error) {
                const message =
                    error.message == "jwt expired"
                        ? "Token is expired"
                        : "Token is invalid"
                return res.status(401).send({ status: false, message })
            }

            req.userId = decodedToken.userId
            console.log("Authentication successfull ✅")
            next();

        })

    } catch (error) {

        return res.status(500).send({ status: false, msg: error.message })

    }

}
const autherization = async function(req,res,next){
    try{
        let _id=req.params.userId
        if(!_id) return res.status(400).send({status:false,message:"enter valid user id"})
        if(_id){
            if(mongoose.Types.ObjectId.isValid(_id)==false) return res.status(400).send({status:false,message:"invalid id"});
        }
        let user= await userModel.findById({_id})
        if(!user) return res.status(404).send({status:false,message:"user not found"})
       
        if(req.userId !=_id)
        return res.status(403).send({status:false,message:"not authorized"})
        console.log("Autherization successfull ✅")
        next();
    }catch(err){
        return res.status(500).send({ status: false, msg: err.message })

    }
}
module.exports = { authentication ,autherization}