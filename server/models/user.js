const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: false 
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: String,
        require: true,
        unique: false
    },
    password: {
        type: String,
        require: true
    },
    userType: {
        type: String,
        // default: 'business'
    },
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
        text: String,
        textEn: String,
        textRu: String,
        textRo: String
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

})

userSchema.methods.encryptPassword = async function () {
    const saltRounds = 10;
    try {
        this.password = await bcrypt.hash(this.password, saltRounds);
        console.log(this.password);
    } catch (error) {
        throw error;
    }
}

userSchema.methods.parse = async function () {
    if (this?.questions) {
        for (let i = 0; i < this.questions.length; i++) {
            // console.log(this.questions[i]);
            this.questions[i].answers.sort((a, b) => a.value > b.value ? -1 : 1);
            // console.log(this.questions[i].answers.sort((a, b) => a.value + b.value));
            
        }
    }
    // question.pic_parsed = config.get('HOST') + question.pic;
    
    // return user;
};

userSchema.methods.validatePassword = async function (reqPassword) {
    return await bcrypt.compare(reqPassword, this.password)
}

userSchema.methods.generateAuthToken = async function () {
    return await jwt.sign( { _id: this._id }, 'jwtPrivateKey');
}

userSchema.methods.validateUser = async function() {
    // const schema = Joi.object({
    //     // name: Joi.string().required(),
    //     email: Joi.string().email().required(),
    //     phone: Joi.string(),
    //     password: Joi.string().required(),
    //     business_name: Joi.string(),
    //     title: Joi.string(),
    //     description: Joi.string(),
    //     google_review_link: Joi.string(),

    // });
    // const { _doc } = this;
    // const { _id, ...fields } = _doc;
    // delete fields["_id"];
    // return await schema.validate(fields);
    return true;
};

userSchema.statics.getByToken = async function(token) {
    try {
        const decoded = jwt.verify(token, 'jwtPrivateKey');
        return await this.findById(decoded._id).populate('questions');
    } catch (error) {
        console.log(error);
    }
}



const User = mongoose.model('User', userSchema)

exports.User = User;