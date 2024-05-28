// const config = require('config');
const cors = require('cors');

module.exports = function(app) {
    require('express-async-errors');
    // if (!config.get('jwtPrivateKey')) {
    //     throw new Error("FATAL ERROR: jwt is not defined.");
    // }

    app.use(cors());
    
}