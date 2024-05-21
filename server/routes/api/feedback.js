const express = require('express');
const { Feedback } = require('../../models/feedback');
const { mergeObjects } = require('../../functions');
const router = express.Router();

router.get('/', async (req, res) => {
    let query = {};
    if (req.query?.userId) {
        query.userId = req.query.userId;
    }
    const feedback = await Feedback.find(query).populate('faqs.question');    
    res.send(feedback);
});

router.post('/', async (req, res) => {
    // const allowedKeys = { ...Feedback.schema.paths };
    // let fields = mergeObjects(allowedKeys, req.body);
    let feedback = new Feedback(req.body);
    feedback = await feedback.save();
    res.send(feedback);
});

router.put('/:id', async (req, res) => {
    let feedback = await Feedback.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
    if (!feedback) return res.status(404).send('not found');
    res.send(feedback);
});

router.delete('/:id', async (req, res) => {
    let feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).send('not found');
    res.send(feedback);
});

router.get('/:id', async (req, res) => {
    let feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).send('not found');
    res.send(feedback);
});

module.exports = router;