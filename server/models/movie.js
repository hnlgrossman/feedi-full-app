const mongoose = require('mongoose');

const Movie = mongoose.model('Movie', mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true,
    },
    numberInStock: {
        type: Number,
        default: 0,
    },
    dailyRentalRate: {
        type: Number,
        default: 0,
    }
}))

exports.Movie = Movie;