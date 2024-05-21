const mongoose = require('mongoose');

const CustomerModel = mongoose.model('Customer', mongoose.Schema({
    name: String,
    phone: String,
    isGold: { type: Boolean, default: false},
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Author'

}))

class Customer extends CustomerModel {
    // static parse(customer) {
    //     customer.parsed = true;
    //     return customer;
    // }
}

exports.Customer = Customer