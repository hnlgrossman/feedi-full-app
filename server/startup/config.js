// const config = require('config');
const cors = require('cors');
const dotenv = require('dotenv');

module.exports = function(app) {
    require('express-async-errors');
    dotenv.config()
    // if (!config.get('jwtPrivateKey')) {
    //     throw new Error("FATAL ERROR: jwt is not defined.");
    // }

    app.use(cors());
    
}