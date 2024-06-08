const mongoose = require('mongoose');

const FeedbackModel = mongoose.model('Feedback', mongoose.Schema({
    is_good: {
        type: Boolean,
        required: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    faqs: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        },
        question_text: {
            type: String
        },
        answer_text: {
            type: String
        },
        rating: {
            type: Number, 
            min: 1,
            max: 4,
            required: true
        }
    }],
    phone: {
        type: String
    },
    name: {
        type: String
    },
    note: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}))

class Feedback extends FeedbackModel {
    // static parse(customer) {
    //     customer.parsed = true;
    //     return customer;
    // }
}

exports.Feedback = Feedback