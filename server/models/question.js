const mongoose = require('mongoose');
const config = require('config')


const questionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    text: {
        type: String,
        required: false
    },
    textEn: {
        type: String,
        required: false
    },
    textRu: {
        type: String,
        required: false
    },
    pic: {
        type: String,
        required: false
    },
    answers: [
        {
            value: { type: Number, require: true},
            text: { type: String, require: true},
            textEn: { type: String, require: false},
            textRu: { type: String, require: false},
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

questionSchema.statics.parse = function (question) {
    question.pic_parsed = config.get('HOST') + question.pic;
    question.answers.sort((a, b) => a.value - b.value);
    return question;
}

const Question = mongoose.model('Question', questionSchema)

// class Question extends QuestionModel {
    
// }

exports.Question = Question