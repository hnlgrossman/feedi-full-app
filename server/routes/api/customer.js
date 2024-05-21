const express = require('express');
const {Customer} = require('../../models/customer')
const {mergeObjects} = require('../../functions');

const router = express.Router();

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name')
    res.send(customers);
})

router.post('/', async (req, res) => {
    const allowedKeys = {
        name: null,
        phone: null,
    } 
    let ret = mergeObjects(allowedKeys, req.body);
    let customer = new Customer(ret);
    customer = await customer.save()
    res.send(customer);
})

router.put('/:id', async (req, res) => {
    const allowedKeys = {
        name: null,
        phone: null,
        isGold: null,
    } 
    let fields = mergeObjects(allowedKeys, req.body);
    let customer = await Customer.findByIdAndUpdate(req.params.id, fields, {new: true})
    if (!customer) return res.status(404).send("not found")
    res.send(customer);
})

router.delete('/:id', async (req, res) => {
    let customer = await Customer.findByIdAndDelete(req.params.id)
    if (!customer) return res.status(404).send("not found")
    res.send(customer);
})

router.get('/:id', async (req, res) => {
    let customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send("not found")
    res.send(customer);
})

module.exports = router;