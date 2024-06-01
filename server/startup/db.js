const mongoose = require('mongoose');

module.exports = function() {
    // const uri = 'mongodb://localhost/foodi';
    console.log('====================================');
    console.log(process.env.MONGODB_CONNECT_URI);
    console.log('====================================');
    // const uri = process.env.MONGODB_CONNECT_URI || 'mongodb+srv://ghananel20:RM9tvXWxhSxood74@feedi.0icwdjt.mongodb.net/?retryWrites=true&w=majority&appName=feedi';
    const uri = process.env.MONGODB_CONNECT_URI;
    mongoose.connect(uri)
    .then(() => {console.log('connecting to mongodb...');})
}