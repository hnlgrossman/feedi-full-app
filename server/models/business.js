const mongoose = require('mongoose');

const BusinessModel = mongoose.model('Business', mongoose.Schema({
    business_name: {
        type: String
    },
    logo: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    qr_code: {
        type: String
    },
    google_review_link: {
        type: String
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }]

}))

class Business extends BusinessModel {
    // static parse(customer) {
    //     customer.parsed = true;
    //     return customer;
    // }
}

exports.Business = Business