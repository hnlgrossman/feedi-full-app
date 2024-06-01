const mongoose = require('mongoose');

module.exports = function() {
    let uri = 'mongodb://localhost/foodi';
    if (process.env.NODE_ENV === 'development') {
        uri = 'mongodb+srv://ghananel20:RM9tvXWxhSxood74@feedi.0icwdjt.mongodb.net/?retryWrites=true&w=majority&appName=feedi';
    } else {
        uri = process.env.MONGODB_CONNECT_URI;
    }
    console.log('====================================');
    console.log(uri);
    console.log('====================================');
    // const uri = process.env.MONGODB_CONNECT_URI;
    mongoose.connect(uri)
    .then(() => {console.log('connecting to mongodb...');})
}