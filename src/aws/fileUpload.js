const aws = require("aws-sdk")
require('dotenv').config();
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

const accessKeyId = process.env.accessKeyId;
const secretAccessKey = process.env.secretAccessKey;
////////////////////////////*AWS*//////////////////////////////////////////////////////////////////

aws.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: "ap-south-1"
})


let uploadFile = async (file,) => {
    return new Promise(function (resolve, reject) {
        
        // this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: '2012-10-17' }); // we will be using the s3 service of aws

        var uploadParams = {
            // ACL: "public-read",
            Bucket: "lottomoney",  
            Key: "lotto/" + file.originalname, 
            Body: file.buffer
        }


        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            // console.log(data.Location)
            // console.log("file uploaded succesfully")
            // console.log(data.Location)
            return resolve(data.Location)
        })
    })
}

module.exports ={uploadFile}