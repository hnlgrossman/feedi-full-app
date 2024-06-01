// const config = require('config');
const cors = require('cors');
const AWS = require('aws-sdk');
const dotenv = require('dotenv')
const path = require('path');

module.exports = function(app) {
    require('express-async-errors');
    // if (!config.get('jwtPrivateKey')) {
    //     throw new Error("FATAL ERROR: jwt is not defined.");
    // }

    dotenv.config({path: path.resolve(__dirname, '../../.env')})
    app.use(cors());
    // global.s3;
    global.s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    });
    
}