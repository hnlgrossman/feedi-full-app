const express = require('express');
const { Question } = require('../../models/question');
const { User } = require('../../models/user');
const { translate, createQuestion } = require('../../functions');
const { requireAuth } = require('../../middleware/auth');
const { text } = require('@fortawesome/fontawesome-svg-core');
const router = express.Router();

router.get('/', async (req, res) => {
    let query = {};
    if (req.query?.user_id) {
        query.userId = req.query.user_id;
    }
    const questions = await Question.find(query);
    const parsedQuestions = await questions.map(question => Question.parse(question.toObject()))
    res.send(parsedQuestions);
});

router.post('/', requireAuth(), async (req, res) => {
    // const allowedKeys = { ...Question.schema.paths };
    // let fields = mergeObjects(allowedKeys, req.body);
    
    // await User.findByIdAndUpdate(req.user._id, { $push: { questions: question._id } })
    const {question} = await createQuestion(req)
    res.send(question);
});

router.put('/:id', async (req, res) => {
    const fields = req.body
    if (fields?.text) {
        fields.textEn = await translate(fields.text, 'he', "en");
        fields.textRu = await translate(fields.text, 'he', "ru");
    }
    let question = await Question.findByIdAndUpdate(req.params.id, fields, { new: true });
    if (!question) return res.status(404).send('not found');
    res.send(question);
});

router.delete('/:id', requireAuth(), async (req, res) => {
    let question = await Question.findByIdAndDelete(req.params.id);
    req.user.questions.pull(req.params.id)
    req.user.save()
    res.send(question);
});

router.get('/:id', async (req, res) => {
    let question = await Question.findById(req.params.id);
    if (!question) return res.status(404).send('not found');
    res.send(question);
});

module.exports = router;