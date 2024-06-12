const express = require('express');
const { Feedback } = require('../../models/feedback');
// const { User } = require('../../models/user');
const { mergeObjects, generateExcel } = require('../../functions');
const { requireAuth } = require('../../middleware/auth')
const router = express.Router();

router.get('/', async (req, res) => {
    let query = {};
    if (req.query?.user_id) {
        query.user_id = req.query.user_id;
    }
    const feedback = await Feedback.find(query).populate('faqs.question');    
    res.send(feedback);
});

router.post('/', async (req, res) => {
    // const allowedKeys = { ...Feedback.schema.paths };
    // let fields = mergeObjects(allowedKeys, req.body);
    if (!req.body.faqs) return res.status(500).send("no feedback")
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

router.get('/get_feedbacks_excel', requireAuth(), async (req, res) => {
    // console.log(req.user._id);
    let query = { user_id: req.user._id };
    // query.userId = req.query.userId;
    const feedbacks = await Feedback.find(query).populate('faqs.question');

    
    const columns = [
        { header: 'שאלה 1', key: 'question_1', width: 40},
        { header: 'תשובה 1', key: 'answer_1', width: 40},
        { header: 'שאלה 2', key: 'question_2', width: 40},
        { header: 'תשובה 2', key: 'answer_2', width: 40},
        { header: 'שאלה 3', key: 'question_3', width: 40},
        { header: 'תשובה 3', key: 'answer_3', width: 40},
        { header: 'שאלה 4', key: 'question_4', width: 40},
        { header: 'תשובה 4', key: 'answer_4', width: 40},
        { header: 'שאלה 5', key: 'question_5', width: 40},
        { header: 'תשובה 5', key: 'answer_5', width: 40},
        { header: 'הועבר להשאיר ביקורת?', key: 'is_good', width: 30},
        { header: 'שם', key: 'name', width: 20},
        { header: 'טלפון', key: 'phone', width: 20},
        { header: 'הערה', key: 'note', width: 60},
    ]
    const data = [];
    for (let item of feedbacks) {
        let row = {};
        row['name'] = item.name; 
        row['phone'] = item.phone; 
        row['note'] = item.note; 
        row['is_good'] = item.is_good; 

        for (let i = 0; i < item?.faqs.length; i++) {
            let faq = item?.faqs[i];
            row['question_' + (i + 1)] = faq.question_text
            row['answer_' + (i + 1)] = faq.answer_text
        }
        data.push(row)
    }

    
    // res.send(data)
    // return;

    const filename = 'feedbacks_report_' + (+new Date) + '.xlsx'
    const buffer = await generateExcel(columns, data);

    const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Key: `excel_reports/${filename}`, // Include folder path in the Key
        Body: buffer,
        ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ACL: 'public-read', // Make the file publicly readable
    };

    const url = await new Promise((resolve, reject) => {
        global.s3.upload(s3Params, (err, data) => {
            if (err) {
                return resolve(null);
            }
            resolve(data.Location)
            // return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/qr_codes/${this.filename}`;
        });
    }) 
    res.send({ url })
});

router.get('/:id', async (req, res) => {
    let feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).send('not found');
    res.send(feedback);
});


module.exports = router;