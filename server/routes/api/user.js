const express = require('express');
const {User} = require('../../models/user');
const {Question} = require('../../models/question');
const {createQuestion, generateQrCode, translate} = require('../../functions');
const { requireAuth }= require('../../middleware/auth')
const router = express.Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');


router.post('/signup', requireAuth('admin'), async (req, res) => {
    let user = await User.findOne({email: req.body.email})
    if (user) return res.status(400).send('this user already registered.');

    // const allowedKeys = {...User.schema.paths};
    // const fields = mergeObjects(allowedKeys, req.body);
    const fields = req.body
    fields.description = {
        text: 'תודה שביקרת אצלנו אנחנו עובדים כל יום על מנת לספק ללקוחות שלנו את החוויה הטובה ביותר וחשוב לנו לשמוע איך היה. נשמח שתענו על מספר שאלות מבטיחים שזה יהיה זריז :)',
        textEn: "Thank you for visiting us, we work every day to provide our customers with the best experience and it is important to us to hear how it was. We'd love for you to answer a few questions, we promise it will be quick :)",
        textRu: "Спасибо, что посетили нас, мы работаем каждый день, чтобы предоставить нашим клиентам лучший опыт, и нам важно услышать, как это было. Мы будем рады, если вы ответите на несколько вопросов, обещаем, что это будет быстро :)",
        textRo: "Vă mulțumim că ne-ați vizitat, lucrăm în fiecare zi pentru a oferi clienților noștri cea mai bună experiență și este important pentru noi să auzim cum a fost. Ne-ar plăcea să răspundeți la câteva întrebări, vă promitem că va fi rapid :)"
    }
    user = new User(fields);
    user = await user.save();
    user.qr_code = await generateQrCode(process.env.HOST_URL + 'review/' + user._id, Math.random().toString(16).slice(2) + '.png')
    // user.qr_code = await generateQrCode(process.env.HOST_URL + 'review/' + user._id, Math.random().toString(16).slice(2) + '.png')
    
    const validation = await user.validateUser();
    if (validation?.error) {
        return res.status(400).send(validation.error.details[0].message);
    }
    await user.encryptPassword();
    // console.log(user);

    const token = await user.generateAuthToken();

    let questions = [
        { text: 'איך האוכל במסעדה?'},
        { text: 'איך השירות במסעדה ?'},
        { text: 'איך האווירה במסעדה?'},
    ];

    for (let i = 0; i < questions.length; i++) {
        let data = {};
        data.body = questions[i];
        data.user = user;
        await createQuestion(data);
    }
    user = await user.save()

    res.header('Authorization', token).send(user);
})

router.post('/login', async (req, res) => {
    const { error } = await validateLogin(req.body);
    if (error) { return res.status(400).send(error.details[0].message) }

    let user = await User.findOne({email: req.body.email})
    if (!user) return res.status(400).send('invalid email or password.');

    const validatePassword = await user.validatePassword(req.body.password)
    if (!validatePassword) return res.status(400).send('invalid email or password.');

    const token = await jwt.sign( { _id: user._id }, 'jwtPrivateKey');
    res.send(token);
})

router.post('/login_as', requireAuth('admin'), async (req, res) => {
    const token = await jwt.sign( { _id: req.body.user_id }, 'jwtPrivateKey');
    res.send(token);
})

router.put('/update_user', requireAuth(), async (req, res) => {
    let user = await User.findOne({_id: req.query.user_id})
    // console.log(user.name);
    let fields = req.body;
    if (fields?.name && fields?.name !== user.name) {
        user.name = fields?.name
    }
    if (fields?.business_name && fields?.business_name !== user.business_name) {
        user.business_name = fields?.business_name
    }
    if (fields?.phone && fields?.phone !== user.phone) {
        // console.log(user.phone, fields?.phone);
        user.phone = fields?.phone
    }
    if (fields?.google_review_link && fields?.google_review_link !== user.google_review_link) {
        // console.log(user.phone, fields?.phone);
        user.google_review_link = fields?.google_review_link;
    }
    if (fields?.selectedLang && fields?.selectedLang !== user.selectedLang) {
        user.selectedLang = fields?.selectedLang;
    }
    if (fields?.email && fields?.email !== user.email) {
        user.email = fields?.email
    }
    if (fields?.userType && fields?.userType !== user.userType) {
        if (req.user.userType != 'admin') {
            return res.status(403).send('you do not have the permission to change this data')
        }
        user.userType = fields?.userType
    }
    if (fields?.password) {
        user.password = fields?.password
        await user.encryptPassword()
    }
    if (fields?.description?.text) {
        console.log(user?.description?.textEn);
        // if (!user?.description?.textEn) {
            user.description.textEn = await translate(fields.description.text, 'he', "en");
        // }
        // if (!user?.description?.textRo) {
            user.description.textRo = await translate(fields.description.text, 'he', "ro");
        // }
        // if (!user?.description?.textRu) {
            user.description.textRu = await translate(fields.description.text, 'he', "ru");
        // }
        // if (!user?.description?.text) {
            user.description.text = fields.description.text;
        // }
    }

    
    
    
    user = await user.save();
    res.status(200).send(user);
})

router.get('/users', requireAuth('admin'), async (req, res) => {
    const users = await User.find({}, { password: 0 } );
    
    res.status(200).send(users);
})

router.get('/:id', async (req, res) => {
    // console.log(req.params);
    let user = await User.findById(req.params.id).populate('questions').select('-password').exec();
    // let user = await User.findById(req.params.id).populate('questions').select(['_id', 'questions'])
    if (!user) return res.status(404).send("not found")
    await user.parse()
    
    res.send(user);
})

router.delete('/:id', requireAuth('admin'), async (req, res) => {
    let deletedUser = await User.findByIdAndDelete(req.params.id);
    const deleteResult = await Question.deleteMany({ userId: req.params.id });
    res.send(deleteResult);
});

async function validateLogin(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    return await schema.validate(req);
}
// router.get('/', async (req, res) => {
//     const movies = await Movie.find().sort('name')
//     res.send(movies);
// })

// router.post('/', async (req, res) => {
//     const allowedKeys = {...Movie.schema.paths};
//     const fields = mergeObjects(allowedKeys, req.body);
//     // res.send(allowedKeys);
//     let movie = new Movie(fields)
//     movie = await movie.save()
//     res.send(movie);
// })

// router.put('/:id', async (req, res) => {
//     const allowedKeys = {...Movie.schema.paths};
//     let fields = mergeObjects(allowedKeys, req.body);
//     let movie = await Movie.findByIdAndUpdate(req.params.id, fields, {new: true})
//     if (!movie) return res.status(404).send("not found")
//     res.send(movie);
// })

// router.delete('/:id', async (req, res) => {
//     let movie = await Movie.findByIdAndDelete(req.params.id)
//     if (!movie) return res.status(404).send("not found")
//     res.send(movie);
// })

// router.get('/:id', async (req, res) => {
//     let movie = await Movie.findById(req.params.id).populate('genre')
//     if (!movie) return res.status(404).send("not found")
//     res.send(movie);
// })

module.exports = router;