const express = require('express');
const {Business} = require('../../models/business');
const {Question} = require('../../models/question');
const {mergeObjects} = require('../../functions');
const router = express.Router();


router.get('/', async (req, res) => {
    const business = await Business.find().sort('name');
    res.send(business);
})

router.post('/', async (req, res) => {
    const allowedKeys = {...Business.schema.paths};
    let fields = mergeObjects(allowedKeys, req.body);
    let business = new Business(fields)
    business = await business.save()
    res.send(business);
})

router.put('/:id', async (req, res) => {
    let business = await Business.findByIdAndUpdate(req.params.id, { name: req.body.name }, {new: true})
    if (!business) return res.status(404).send("not found")
    res.send(business);
})

router.delete('/:id', async (req, res) => {
    let business = await Business.findByIdAndDelete(req.params.id)
    if (!business) return res.status(404).send("not found")
    res.send(business);
})

router.get('/:id', async (req, res) => {
    let business = await Business.findById(req.params.id).populate('questions');
    if (!business) return res.status(404).send("not found");

    res.send(business);
})

module.exports = router;