const mongoose = require('mongoose');

const Genre = mongoose.model('Genre', mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    test: String
}))



exports.Genre = Genre;